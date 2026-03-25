import { AuditLog as PrismaAuditLog } from '@prisma/client';
import { AuditLogEntity } from './audit-log.entity';
import { AuditLogResponse } from './dto/response/audit-log.response';
import { AuditAction } from './audit-action.enum';
import { UserSummary } from '../users';

/** Prisma AuditLog with the user relation included */
type PrismaAuditLogFull = PrismaAuditLog & {
  user: UserSummary;
};

export class AuditMapper {
  static toEntity(prisma: PrismaAuditLogFull): AuditLogEntity {
    return new AuditLogEntity({
      id: prisma.id,
      action: prisma.action as AuditAction,
      metadata: (prisma.metadata as Record<string, unknown>) ?? {},
      demandeId: prisma.demandeId,
      userId: prisma.userId,
      user: prisma.user,
      createdAt: prisma.createdAt,
    });
  }

  static toResponseDto(entity: AuditLogEntity): AuditLogResponse {
    return {
      id: entity.id,
      action: entity.action,
      metadata: entity.metadata,
      demandeId: entity.demandeId,
      user: entity.user,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
