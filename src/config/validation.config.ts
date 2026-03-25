import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Registers the global ValidationPipe.
 */
export function setupValidation(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      // strips properties not declared in the DTO
      whitelist: true,
      // throws 400 if unknown properties are sent
      forbidNonWhitelisted: true,
      // converts plain JSON objects to typed DTO class instances
      transform: true,
      // auto-converts query param strings to their declared types (e.g. "true" → boolean, "1" → number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
