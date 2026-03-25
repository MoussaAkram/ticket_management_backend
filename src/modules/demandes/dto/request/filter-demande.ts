import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { DemandeStatus } from '../../demande-status.enum';

/**
 * Supports status filtering and page-based pagination.
 */
export class FilterDemandeRequest {
  @ApiPropertyOptional({ enum: DemandeStatus })
  @IsEnum(DemandeStatus, { message: 'Statut invalide' })
  @IsOptional()
  status?: DemandeStatus;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt({ message: 'La page doit être un entier' })
  @Min(1, { message: 'La page doit être au moins 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt({ message: 'La limite doit être un entier' })
  @Min(1, { message: 'La limite doit être au moins 1' })
  @Max(100, { message: 'La limite ne peut pas dépasser 100' })
  @IsOptional()
  limit?: number = 20;
}
