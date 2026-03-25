import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository, CreateAuditLogInput } from './audit.repository';
import { AuditLogResponse } from './dto/response/audit-log.response';
import { AuditMapper } from './audit.mapper';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  private logger = new Logger(AuditService.name);
  /**
   * Records an immutable audit log entry.
   */
  async log(input: CreateAuditLogInput): Promise<void> {
    await this.auditRepository.create(input);
    this.logger.debug(`--- record log ${JSON.stringify(input)}`);
  }

  /**
   * Returns the full audit trail for a demande, oldest entry first.
   */
  async findByDemandeId(demandeId: string): Promise<AuditLogResponse[]> {
    const logs = await this.auditRepository.findByDemandeId(demandeId);
    this.logger.debug(`--- find logs for demande ${demandeId}`);

    return logs.map((l) => AuditMapper.toResponseDto(l));
  }
}
