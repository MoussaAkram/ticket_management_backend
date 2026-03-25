import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ example: 'Alice Martin' })
  name!: string;

  @ApiProperty({ example: 'alice.martin@demo.com' })
  email!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt!: string;
}
