import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { buildConnectionString } from './connection';
import { PrismaClient } from '@prisma/client';

/**
 * NestJS injectable wrapper around PrismaClient.
 *
 * Prisma 7 requires a driver adapter to be passed at runtime —
 * prisma.config.ts is only read by the Prisma CLI (migrations, generate).
 * At application runtime, the adapter must be provided explicitly.
 *
 * PrismaPg reads the connection string from individual env vars.
 * Env vars are loaded by NestJS before this service is instantiated
 * so no dotenv import is needed here.
 *
 * Lives in backend/prisma/ alongside the schema and generated client —
 * not in src/shared — because it belongs to the Prisma layer.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * NestJS Logger — preferred over console.log in application code because:
   * - Prefixes output with class name and log level
   * - Respects the app's configured log level
   * - Can be swapped for a custom logger without changing this file
   */
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({ connectionString: buildConnectionString() });
    super({ adapter });
  }

  /**
   * Establishes the database connection when the NestJS module is initialized.
   * Called automatically by NestJS on application startup.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  /**
   * Closes the database connection when the NestJS module is destroyed.
   * Ensures no connections remain open when the application shuts down.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
