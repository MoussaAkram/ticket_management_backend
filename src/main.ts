import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupCors, setupSwagger, setupValidation } from './config';
import { HttpExceptionFilter } from './shared';
import 'dotenv/config';

async function bootstrap(): Promise<void> {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const prefix = process.env.API_VERSION;

  if (!prefix) {
    throw new Error('prefix is not defined');
  }
  app.setGlobalPrefix(prefix);

  setupCors(app);
  setupValidation(app);
  setupSwagger(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.BACK_END_PORT;
  if (!port) {
    throw new Error('port is not defined');
  }
  await app.listen(port);

  logger.log(`Application running on http://localhost:${port}/${prefix}`);
  logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
