import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import type { ResponseJsonType } from '#types/request';

@Catch()
export class HttpExceptionFilter<HttpException> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message =
      (exception as any).message ||
      (exception as any).message.message ||
      (exception as any).message.error ||
      null;

    const statusMaps = [
      {
        rule: () => exception instanceof HttpException,
        result: () => (exception as any).getStatus(),
      },
      {
        rule: () => (exception as any).name === 'ValidationError',
        result: () => HttpStatus.BAD_REQUEST,
      },
      {
        rule: () => true,
        result: () => HttpStatus.INTERNAL_SERVER_ERROR,
      },
    ];
    let status: number;
    statusMaps.some(({ rule, result }) => {
      if (rule()) {
        status = result();
        return true;
      }
      return false;
    });
    const url = request.originalUrl;

    const errorResponse: ResponseJsonType = {
      data: null,
      message,
      code: 1,
      url,
    };
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
