import { Module } from '@nestjs/common';
import { FileController } from './files.controller';
import { FilesServer } from './files.service';

@Module({
  controllers: [FileController],
  providers: [FilesServer],
})
export class FilesModule {}
