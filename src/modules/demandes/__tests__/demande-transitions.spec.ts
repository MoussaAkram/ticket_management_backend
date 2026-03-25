import { BadRequestException } from '@nestjs/common';
import {
  assertTransitionAllowed,
  getAllowedTransitions,
} from '../demande-transitions';
import { DemandeStatus } from '../demande-status.enum';

describe('demande-transitions', () => {
  describe('getAllowedTransitions', () => {
    it('BROUILLON allows SOUMISE and ANNULEE', () => {
      expect(getAllowedTransitions(DemandeStatus.BROUILLON)).toEqual([
        DemandeStatus.SOUMISE,
        DemandeStatus.ANNULEE,
      ]);
    });

    it('SOUMISE allows VALIDEE, REJETEE, ANNULEE', () => {
      expect(getAllowedTransitions(DemandeStatus.SOUMISE)).toEqual([
        DemandeStatus.VALIDEE,
        DemandeStatus.REJETEE,
        DemandeStatus.ANNULEE,
      ]);
    });

    it('ANNULEE is terminal — no transitions', () => {
      expect(getAllowedTransitions(DemandeStatus.REJETEE)).toHaveLength(0);
    });
    it('VALIDEE is terminal — no transitions', () => {
      expect(getAllowedTransitions(DemandeStatus.VALIDEE)).toHaveLength(0);
    });

    it('ANNULEE is terminal — no transitions', () => {
      expect(getAllowedTransitions(DemandeStatus.ANNULEE)).toHaveLength(0);
    });
  });

  describe('assertTransitionAllowed', () => {
    it.each([
      [DemandeStatus.BROUILLON, DemandeStatus.SOUMISE],
      [DemandeStatus.BROUILLON, DemandeStatus.ANNULEE],
      [DemandeStatus.SOUMISE, DemandeStatus.VALIDEE],
      [DemandeStatus.SOUMISE, DemandeStatus.REJETEE],
      [DemandeStatus.SOUMISE, DemandeStatus.ANNULEE],
    ])('allows %s → %s', (from, to) => {
      expect(() => assertTransitionAllowed(from, to)).not.toThrow();
    });

    it.each([
      [DemandeStatus.BROUILLON, DemandeStatus.VALIDEE],
      [DemandeStatus.BROUILLON, DemandeStatus.REJETEE],
      [DemandeStatus.VALIDEE, DemandeStatus.SOUMISE],
      [DemandeStatus.VALIDEE, DemandeStatus.ANNULEE],
      [DemandeStatus.ANNULEE, DemandeStatus.BROUILLON],
      [DemandeStatus.REJETEE, DemandeStatus.VALIDEE],
      [DemandeStatus.REJETEE, DemandeStatus.ANNULEE],
    ])('rejects %s → %s', (from, to) => {
      expect(() => assertTransitionAllowed(from, to)).toThrow(
        BadRequestException,
      );
    });
  });
});
