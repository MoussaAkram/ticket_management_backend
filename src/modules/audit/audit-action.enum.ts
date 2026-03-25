/**
 * All possible audit actions recorded in the system.
 * Mirrors the AuditAction enum in prisma/schema/audit-log.prisma.
 */
export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DELETED = 'DELETED',
}
