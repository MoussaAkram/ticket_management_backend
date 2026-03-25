import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DemandeStatus } from '../../demande-status.enum';
import { UserSummaryDto } from '@/modules/users';

export class DemandeListResponse {
  @ApiProperty() id!: string;
  @ApiProperty() reference!: string;
  @ApiProperty() title!: string;
  @ApiProperty({ enum: DemandeStatus }) status!: DemandeStatus;
  @ApiProperty({ type: UserSummaryDto }) createdBy!: UserSummaryDto;
  @ApiPropertyOptional({ type: UserSummaryDto })
  assignedTo!: UserSummaryDto | null;
  @ApiProperty() createdAt!: string;
}
