import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import nextServer from './next.app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

// bootstrap();
nextServer.prepare().then(bootstrap);
