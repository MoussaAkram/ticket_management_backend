import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditLogResponse } from './dto/response/audit-log.response';

@ApiTags('Audit')
@Controller('demandes/:demandeId/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Returns all audit log entries for a demande, oldest first.
   */
  @Get()
  @ApiOperation({ summary: 'Get the full audit trail for a demande' })
  @ApiParam({ name: 'demandeId', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, type: [AuditLogResponse] })
  findByDemandeId(
    @Param('demandeId') demandeId: string,
  ): Promise<AuditLogResponse[]> {
    return this.auditService.findByDemandeId(demandeId);
  }
}
