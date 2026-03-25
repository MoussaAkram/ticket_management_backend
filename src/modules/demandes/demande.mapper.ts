import { Demande as PrismaDemande } from '@prisma/client';
import { DemandeEntity } from './demande.entity';
import { DemandeResponse } from './dto/response/demande.response';
import { DemandeListResponse } from './dto/response/demande-list.response';
import { DemandeStatus } from './demande-status.enum';
import { UserSummary } from '../users';

/** Prisma Demande with required relations included */
type PrismaDemandeFull = PrismaDemande & {
  createdBy: UserSummary;
  assignedTo: UserSummary | null;
};

export class DemandeMapper {
  static toEntity(prisma: PrismaDemandeFull): DemandeEntity {
    return new DemandeEntity({
      id: prisma.id,
      reference: prisma.reference,
      title: prisma.title,
      description: prisma.description,
      status: prisma.status as DemandeStatus,
      createdById: prisma.createdById,
      createdBy: prisma.createdBy,
      assignedToId: prisma.assignedToId,
      assignedTo: prisma.assignedTo,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      deletedAt: prisma.deletedAt,
    });
  }

  static toResponseDto(entity: DemandeEntity): DemandeResponse {
    return {
      id: entity.id,
      reference: entity.reference,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdBy: entity.createdBy,
      assignedTo: entity.assignedTo,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toListResponseDto(entity: DemandeEntity): DemandeListResponse {
    return {
      id: entity.id,
      reference: entity.reference,
      title: entity.title,
      status: entity.status,
      createdBy: entity.createdBy,
      assignedTo: entity.assignedTo,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
