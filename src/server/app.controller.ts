import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import nextServer from './next.app';

const handle = nextServer.getRequestHandler();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() req: Request, @Res() res: Response) {
    // return this.appService.getHello();
    await nextServer.render(req, res, '/home');
  }

  @Get('*')
  handle(@Req() req: Request, @Res() res: Response) {
    return handle(req, res);
  }
}
