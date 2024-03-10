import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.setGlobalPrefix(configService.get('API_PREFIX'));

  app.use(express.static('public'));

  const port = configService.get<number>('PORT');
  await app.listen(port).then(() => {
    console.log(`API server started on port ${port}`);
  });
}
bootstrap();
