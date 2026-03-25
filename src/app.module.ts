import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UsersModule, DemandesModule, AuditModule } from './modules';

/**
 * Root application module.
 */
@Module({
  imports: [PrismaModule, UsersModule, AuditModule, DemandesModule],
})
export class AppModule {}
