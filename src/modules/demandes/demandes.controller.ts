import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DemandesService } from './demandes.service';
import { CreateDemandeRequest } from './dto/request/create-demande';
import { UpdateDemandeRequest } from './dto/request/update-demande';
import { FilterDemandeRequest } from './dto/request/filter-demande';
import { DemandeResponse } from './dto/response/demande.response';
import { DemandeStatus } from './demande-status.enum';
import { PaginatedDemandeResponse } from './dto/response/paginated-demande.response';

/** Inline DTO for the status change endpoint */
class ChangeStatusDto {
  @ApiProperty({ enum: DemandeStatus })
  @IsEnum(DemandeStatus, { message: 'Statut invalide' })
  status!: DemandeStatus;
}

@ApiTags('Demandes')
@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  /**
   * Returns a paginated list of active demandes.
   * Supports optional status filter and page/limit params.
   */
  @Get()
  @ApiOperation({ summary: 'List active demandes with pagination' })
  @ApiResponse({ status: 200, type: PaginatedDemandeResponse })
  findAll(
    @Query() filters: FilterDemandeRequest,
  ): Promise<PaginatedDemandeResponse> {
    return this.demandesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single demande by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, type: DemandeResponse })
  @ApiResponse({ status: 404, description: 'Demande not found' })
  findOne(@Param('id') id: string): Promise<DemandeResponse> {
    return this.demandesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new demande' })
  @ApiResponse({ status: 201, type: DemandeResponse })
  create(@Body() dto: CreateDemandeRequest): Promise<DemandeResponse> {
    return this.demandesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update title, description, or assignedTo' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, type: DemandeResponse })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDemandeRequest,
  ): Promise<DemandeResponse> {
    return this.demandesService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Change demande status — enforces transition rules',
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, type: DemandeResponse })
  @ApiResponse({ status: 400, description: 'Invalid transition' })
  changeStatus(
    @Param('id') id: string,
    @Body() body: ChangeStatusDto,
  ): Promise<DemandeResponse> {
    return this.demandesService.changeStatus(id, body.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete — moves to trash' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 204 })
  softDelete(@Param('id') id: string): Promise<void> {
    return this.demandesService.softDelete(id);
  }
}
