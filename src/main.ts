import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  app.use('/uploads', express.static('uploads'));
}
bootstrap();
