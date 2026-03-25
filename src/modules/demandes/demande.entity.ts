import { UserSummary } from '../users';
import { DemandeStatus } from './demande-status.enum';

export class DemandeEntity {
  id!: string;
  reference!: string;
  title!: string;
  description!: string;
  status!: DemandeStatus;
  createdById!: string;
  createdBy!: UserSummary;
  assignedToId!: string | null;
  assignedTo!: UserSummary | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  constructor(partial: Partial<DemandeEntity>) {
    Object.assign(this, partial);
  }
}
