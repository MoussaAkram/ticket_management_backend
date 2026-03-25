import { Module } from '@nestjs/common';
import { DemandesController } from './demandes.controller';
import { DemandesService } from './demandes.service';
import { DemandeRepository } from './demande.repository';
import { AuditModule } from '../audit/audit.module';

/**
 * Demandes feature module.
 * Imports AuditModule so DemandesService can inject AuditService
 * for recording audit log entries on every mutation.
 */
@Module({
  imports: [AuditModule],
  controllers: [DemandesController],
  providers: [DemandesService, DemandeRepository],
})
export class DemandesModule {}
