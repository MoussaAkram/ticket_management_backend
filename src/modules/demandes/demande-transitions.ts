import { BadRequestException } from '@nestjs/common';
import { DemandeStatus } from './demande-status.enum';

/**
 * Defines which status transitions are allowed from each status.
 *
 * BROUILLON → SOUMISE, ANNULEE
 * SOUMISE   → VALIDEE, REJETEE, ANNULEE
 * REJETEE   → (terminal — no transitions)
 * VALIDEE   → (terminal — no transitions)
 * ANNULEE   → (terminal — no transitions)
 */
const ALLOWED_TRANSITIONS: Record<DemandeStatus, DemandeStatus[]> = {
  [DemandeStatus.BROUILLON]: [DemandeStatus.SOUMISE, DemandeStatus.ANNULEE],
  [DemandeStatus.SOUMISE]: [
    DemandeStatus.VALIDEE,
    DemandeStatus.REJETEE,
    DemandeStatus.ANNULEE,
  ],
  [DemandeStatus.REJETEE]: [],
  [DemandeStatus.VALIDEE]: [],
  [DemandeStatus.ANNULEE]: [],
};

/**
 * Returns the list of statuses reachable from the given status.
 */
export function getAllowedTransitions(from: DemandeStatus): DemandeStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

/**
 * Validates that a transition is allowed.
 * Throws BadRequestException with a descriptive message if not.
 */
export function assertTransitionAllowed(
  from: DemandeStatus,
  to: DemandeStatus,
): void {
  const allowed = ALLOWED_TRANSITIONS[from];

  if (!allowed) {
    throw new BadRequestException(
      `Statut source invalide ou non géré : "${from}"`,
    );
  }

  if (!allowed.includes(to)) {
    throw new BadRequestException(
      `Transition invalide : "${from}" → "${to}". ` +
        `Transitions autorisées depuis "${from}" : ` +
        (allowed.length ? allowed.join(', ') : 'aucune (statut terminal)'),
    );
  }
}
