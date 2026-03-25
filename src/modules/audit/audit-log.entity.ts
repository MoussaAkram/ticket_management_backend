import { UserSummary } from '../users';
import { AuditAction } from './audit-action.enum';

export class AuditLogEntity {
  id!: string;
  action!: AuditAction;
  metadata!: Record<string, unknown>;
  demandeId!: string;
  userId!: string;
  user!: UserSummary;
  createdAt!: Date;

  constructor(partial: Partial<AuditLogEntity>) {
    Object.assign(this, partial);
  }
}
