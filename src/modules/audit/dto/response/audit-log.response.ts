import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../../audit-action.enum';
import { UserSummaryDto } from '../../../users';

export class AuditLogResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: AuditAction })
  action!: AuditAction;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { status: { from: 'BROUILLON', to: 'SOUMISE' } },
  })
  metadata?: Record<string, unknown>;

  @ApiProperty()
  demandeId!: string;

  @ApiProperty({ type: UserSummaryDto })
  user!: UserSummaryDto;

  @ApiProperty()
  createdAt!: string;
}
