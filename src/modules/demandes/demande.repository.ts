import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DemandeEntity } from './demande.entity';
import { DemandeMapper } from './demande.mapper';
import { DemandeStatus } from './demande-status.enum';
import { CreateDemandeRequest } from './dto/request/create-demande';
import { UpdateDemandeRequest } from './dto/request/update-demande';
import { Prisma } from '@prisma/client';

/** Reusable include shape */
const WITH_RELATIONS = {
  createdBy: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
} as const;

@Injectable()
export class DemandeRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns a paginated list of active demandes, optionally filtered by status.
   */
  async findAll(
    status?: DemandeStatus,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: DemandeEntity[];
    total: number;
  }> {
    const where: Prisma.DemandeWhereInput = {
      deletedAt: null,
      ...(status && { status }),
    };

    const [total, demandes] = await Promise.all([
      this.prisma.demande.count({ where }),
      this.prisma.demande.findMany({
        where,
        include: WITH_RELATIONS,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: demandes.map((d) => DemandeMapper.toEntity(d)),
      total,
    };
  }

  /**
   * Returns a single active demande by id.
   * Throws NotFoundException if not found or soft-deleted.
   */
  async findById(id: string): Promise<DemandeEntity> {
    const demande = await this.prisma.demande.findFirst({
      where: { id, deletedAt: null },
      include: WITH_RELATIONS,
    });

    if (!demande) {
      throw new NotFoundException(`Demande "${id}" introuvable`);
    }

    return DemandeMapper.toEntity(demande);
  }

  /**
   * Creates a new demande with BROUILLON status.
   */
  async create(
    dto: CreateDemandeRequest,
    createdById: string,
    reference: string,
  ): Promise<DemandeEntity> {
    const demande = await this.prisma.demande.create({
      data: {
        reference,
        title: dto.title,
        description: dto.description,
        createdById,
        assignedToId: dto.assignedToId ?? null,
      },
      include: WITH_RELATIONS,
    });
    return DemandeMapper.toEntity(demande);
  }

  /**
   * Updates title, description, or assignedToId of a demande.
   * Only provided fields are updated — undefined fields are ignored.
   */
  async update(id: string, dto: UpdateDemandeRequest): Promise<DemandeEntity> {
    const demande = await this.prisma.demande.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        // Explicitly allow setting assignedToId to null (unassign)
        ...(dto.assignedToId !== undefined && {
          assignedToId: dto.assignedToId ?? null,
        }),
      },
      include: WITH_RELATIONS,
    });
    return DemandeMapper.toEntity(demande);
  }

  /**
   * Updates only the status field of a demande.
   */
  async updateStatus(
    id: string,
    status: DemandeStatus,
  ): Promise<DemandeEntity> {
    const demande = await this.prisma.demande.update({
      where: { id },
      data: { status },
      include: WITH_RELATIONS,
    });
    return DemandeMapper.toEntity(demande);
  }

  /**
   * Soft-deletes a demande by setting deletedAt to the current timestamp.
   */
  async softDelete(id: string): Promise<void> {
    await this.prisma.demande.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
