import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication): void {
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });
}
