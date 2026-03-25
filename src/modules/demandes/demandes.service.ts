import { Injectable, Logger } from '@nestjs/common';
import { DemandeRepository } from './demande.repository';
import { DemandeMapper } from './demande.mapper';
import { DemandeResponse } from './dto/response/demande.response';
import { CreateDemandeRequest } from './dto/request/create-demande';
import { UpdateDemandeRequest } from './dto/request/update-demande';
import { FilterDemandeRequest } from './dto/request/filter-demande';
import { DemandeStatus } from './demande-status.enum';
import { assertTransitionAllowed } from './demande-transitions';
import { getDefaultUserId, isDifferent } from '../../shared';
import { randomBytes } from 'crypto';
import { PaginatedDemandeResponse } from './dto/response/paginated-demande.response';
import { AuditAction } from '../audit/audit-action.enum';
import { AuditService } from '../audit/audit.service';
import { DemandeEntity } from './demande.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class DemandesService {
  constructor(
    private readonly demandeRepository: DemandeRepository,
    private readonly auditService: AuditService,
  ) {}

  private logger = new Logger(DemandesService.name);
  /**
   * Returns a paginated list of active demandes, optionally filtered by status.
   */
  async findAll(
    filters: FilterDemandeRequest,
  ): Promise<PaginatedDemandeResponse> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const { data, total } = await this.demandeRepository.findAll(
      filters.status,
      page,
      limit,
    );
    this.logger.debug('--- fetch all demandes ---');

    return {
      data: data.map((d) => DemandeMapper.toListResponseDto(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Returns a single active demande by id.
   * Throws NotFoundException if not found.
   */
  async findById(id: string): Promise<DemandeResponse> {
    const demande = await this.demandeRepository.findById(id);
    this.logger.debug(`fetch demande with id ${id}`);
    return DemandeMapper.toResponseDto(demande);
  }

  /**
   * Creates a new demande with BROUILLON status.
   */
  async create(dto: CreateDemandeRequest): Promise<DemandeResponse> {
    const userId = getDefaultUserId();
    const reference = this.generateReference();
    const demande = await this.demandeRepository.create(dto, userId, reference);

    await this.auditService.log({
      action: AuditAction.CREATED,
      demandeId: demande.id,
      userId,
      metadata: {},
    });

    this.logger.debug(`--- create a demande ${JSON.stringify(demande)} ---`);

    return DemandeMapper.toResponseDto(demande);
  }

  /**
   * Updates title, description, or assignedToId.
   * Logs an UPDATED entry with the list of changed fields.
   */
  async update(
    id: string,
    dto: UpdateDemandeRequest,
  ): Promise<DemandeResponse> {
    const userId = getDefaultUserId();

    const before = await this.demandeRepository.findById(id);
    const demande = await this.demandeRepository.update(id, dto);

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    type UpdateKeys = keyof UpdateDemandeRequest & keyof DemandeEntity;

    for (const key of Object.keys(dto) as UpdateKeys[]) {
      const newValue = dto[key];
      const oldValue = before[key];

      if (newValue !== undefined && isDifferent(newValue, oldValue)) {
        changes[key as string] = { from: oldValue, to: newValue };
      }
    }

    if (Object.keys(changes).length > 0) {
      await this.auditService.log({
        action: AuditAction.UPDATED,
        demandeId: id,
        userId,
        metadata: changes as Prisma.InputJsonValue,
      });
    }
    this.logger.debug(`--- update a demande ${JSON.stringify(dto)} ---`);
    return DemandeMapper.toResponseDto(demande);
  }

  /**
   * Changes the status of a demande.
   * Validates the transition via the state machine before updating.
   */
  async changeStatus(
    id: string,
    newStatus: DemandeStatus,
  ): Promise<DemandeResponse> {
    const userId = getDefaultUserId();
    const demande = await this.demandeRepository.findById(id);

    // Throws BadRequestException if the transition is not allowed
    assertTransitionAllowed(demande.status, newStatus);

    const updated = await this.demandeRepository.updateStatus(id, newStatus);

    await this.auditService.log({
      action: AuditAction.STATUS_CHANGED,
      demandeId: id,
      userId,
      metadata: {
        status: {
          from: demande.status,
          to: newStatus,
        },
      },
    });
    this.logger.debug(`--- change status of the demande to ${newStatus} ---`);

    return DemandeMapper.toResponseDto(updated);
  }

  /**
   * Soft-deletes a demande.
   */
  async softDelete(id: string): Promise<void> {
    const userId = getDefaultUserId();

    // Verify the demande exists before deleting
    await this.demandeRepository.findById(id);
    await this.demandeRepository.softDelete(id);

    await this.auditService.log({
      action: AuditAction.DELETED,
      demandeId: id,
      userId,
      metadata: {},
    });
    this.logger.debug(`--- Delete the demande with id ${id} ---`);
  }

  /**
   * Generates the next sequential reference string.
   * Format: DEM-A3F9C2D1, DEM-P4F9C2S5, etc.
   */
  private generateReference(): string {
    return `DEM-${randomBytes(4).toString('hex').toUpperCase()}`;
  }
}
