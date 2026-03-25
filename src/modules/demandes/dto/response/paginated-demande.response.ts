import { ApiProperty } from '@nestjs/swagger';
import { DemandeListResponse } from './demande-list.response';
import { IsInt, Max, Min } from 'class-validator';

export class PaginatedDemandeResponse {
  @ApiProperty({ type: [DemandeListResponse] })
  data!: DemandeListResponse[];

  @ApiProperty({
    example: 45,
    description: 'Total number of matching demandes',
  })
  total!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;

  @ApiProperty({ example: 3, description: 'Total number of pages' })
  totalPages!: number;
}
