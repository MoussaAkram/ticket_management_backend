import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDemandeRequest {
  @ApiProperty({ example: 'Demande de matériel informatique', maxLength: 100 })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 100 caractères' })
  title!: string;

  @ApiProperty({ example: "Besoin d'un second écran." })
  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire' })
  description!: string;

  @ApiPropertyOptional({
    example: 'uuid-v4',
    description: 'UUID of the user to assign',
  })
  @IsUUID('4', { message: 'assignedToId doit être un UUID valide' })
  @IsOptional()
  assignedToId?: string;
}
