import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogEntity } from './audit-log.entity';
import { AuditMapper } from './audit.mapper';
import { AuditAction } from './audit-action.enum';
import { Prisma } from '@prisma/client';

/** Input shape for creating a new audit log entry */
export interface CreateAuditLogInput {
  action: AuditAction;
  demandeId: string;
  userId: string;
  metadata: Prisma.InputJsonValue;
}

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all audit logs for a given demande, ordered oldest → newest.
   */
  async findByDemandeId(demandeId: string): Promise<AuditLogEntity[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { demandeId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return logs.map((l) => AuditMapper.toEntity(l));
  }

  /**
   * Creates a single immutable audit log entry.
   */
  async create(input: CreateAuditLogInput): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action: input.action,
        demandeId: input.demandeId,
        userId: input.userId,
        metadata: input.metadata,
      },
    });
  }
}
