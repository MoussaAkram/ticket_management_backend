/**
 * All possible statuses for a Demande.
 * Mirrors the DemandeStatus enum in prisma/schema/demande.prisma.
 */
export enum DemandeStatus {
  BROUILLON = 'BROUILLON',
  SOUMISE = 'SOUMISE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
  ANNULEE = 'ANNULEE',
}
