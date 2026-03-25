import { ApiProperty } from '@nestjs/swagger';

/**
 * Used wherever a response needs to reference a user without
 * exposing the full User object.
 */
export class UserSummaryDto {
  @ApiProperty({ example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ example: 'Alice Martin' })
  name!: string;
}
