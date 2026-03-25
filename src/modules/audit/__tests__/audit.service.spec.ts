import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit.service';
import { AuditRepository } from '../audit.repository';
import { AuditLogEntity } from '../audit-log.entity';
import { AuditAction } from '../audit-action.enum';

const mockLog = new AuditLogEntity({
  id: 'log-1',
  action: AuditAction.CREATED,
  metadata: {},
  demandeId: 'dem-1',
  userId: 'user-1',
  user: { id: 'user-1', name: 'Alice Martin' },
  createdAt: new Date('2024-01-15T10:00:00Z'),
});

const mockRepository = {
  create: jest.fn().mockResolvedValue(undefined),
  findByDemandeId: jest.fn().mockResolvedValue([mockLog]),
};

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: AuditRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('log', () => {
    it('should call repository.create with the provided input', async () => {
      const input = {
        action: AuditAction.CREATED,
        demandeId: 'dem-1',
        userId: 'user-1',
        metadata: {},
      };

      await service.log(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should return void — callers do not depend on the return value', async () => {
      const result = await service.log({
        action: AuditAction.STATUS_CHANGED,
        demandeId: 'dem-1',
        userId: 'user-1',
        metadata: { from: 'BROUILLON', to: 'SOUMISE' },
      });

      expect(result).toBeUndefined();
    });
  });

  describe('findByDemandeId', () => {
    it('should return mapped audit log response DTOs', async () => {
      const result = await service.findByDemandeId('dem-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'log-1',
        action: AuditAction.CREATED,
        demandeId: 'dem-1',
        user: { name: 'Alice Martin' },
      });
      // Dates must be ISO strings in the response
      expect(typeof result[0].createdAt).toBe('string');
      expect(mockRepository.findByDemandeId).toHaveBeenCalledWith('dem-1');
    });
  });
});
