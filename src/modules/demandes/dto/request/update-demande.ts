import { PartialType } from '@nestjs/swagger';
import { CreateDemandeRequest } from './create-demande';

/**
 * Fields from CreateDemandeDto become optional.
 */
export class UpdateDemandeRequest extends PartialType(CreateDemandeRequest) {}
