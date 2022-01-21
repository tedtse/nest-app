import { createWriteStream } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import {
  Controller,
  Post,
  UseInterceptors,
  UseFilters,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { HttpExceptionFilter } from '@server/filters/http-exception.filter';
import { ResponseInterceptor } from '@server/interceptors/transform-interceptor';

@Controller('api/files')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor())
export class FileController {
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const hash = createHash('md5').update(file.buffer).digest('hex');
    const suffix = file.mimetype.split('/')?.[1];
    const writeImage = createWriteStream(
      join(process.cwd(), 'public', `${hash}.${suffix}`),
    );
    writeImage.write(file.buffer);
    return `/static/${hash}.${suffix}`;
  }
}
