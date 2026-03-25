import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DemandesService } from '../demandes.service';
import { DemandeRepository } from '../demande.repository';
import { AuditService } from '../../audit/audit.service';
import { DemandeEntity } from '../demande.entity';
import { DemandeStatus } from '../demande-status.enum';

process.env['DEFAULT_USER_ID'] = 'default-user-uuid';

const mockUser = { id: 'user-1', name: 'Alice' };
const mockDemande = new DemandeEntity({
  id: 'dem-1',
  reference: 'DEM-0001',
  title: 'Test demande',
  description: 'Description',
  status: DemandeStatus.BROUILLON,
  createdById: 'user-1',
  createdBy: mockUser,
  assignedToId: null,
  assignedTo: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});

const mockRepository = {
  findAll: jest.fn().mockResolvedValue({ data: [mockDemande], total: 1 }),
  findById: jest.fn().mockResolvedValue(mockDemande),
  create: jest.fn().mockResolvedValue(mockDemande),
  update: jest.fn().mockResolvedValue(mockDemande),
  updateStatus: jest.fn().mockResolvedValue({
    ...mockDemande,
    status: DemandeStatus.SOUMISE,
  }),
  softDelete: jest.fn().mockResolvedValue(undefined),
  generateReference: jest.fn().mockResolvedValue('DEM-0001'),
};

const mockAuditService = {
  log: jest.fn().mockResolvedValue(undefined),
};

describe('DemandesService', () => {
  let service: DemandesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemandesService,
        { provide: DemandeRepository, useValue: mockRepository },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<DemandesService>(DemandesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return paginated response with correct metadata', async () => {
      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a demande and log CREATED action', async () => {
      await service.create({ title: 'Test', description: 'Desc' });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATED' }),
      );
    });
  });

  describe('update', () => {
    it('should edit a demande and log action', async () => {
      await service.update('dem-1', { title: 'Test1' });

      expect(mockRepository.update).toHaveBeenCalledTimes(1);

      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATED',
          demandeId: 'dem-1',
          userId: 'default-user-uuid',
          metadata: {
            title: {
              from: 'Test demande',
              to: 'Test1',
            },
          },
        }),
      );
    });
    it('should throw NotFoundException if demande does not exist', async () => {
      mockRepository.findById.mockRejectedValueOnce(new NotFoundException());

      await expect(
        service.update('non-existent', { title: 'Test1' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeStatus', () => {
    it('should change status and log STATUS_CHANGED with from/to metadata', async () => {
      await service.changeStatus('dem-1', DemandeStatus.SOUMISE);

      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        'dem-1',
        DemandeStatus.SOUMISE,
      );
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'STATUS_CHANGED',
          metadata: {
            status: {
              from: DemandeStatus.BROUILLON,
              to: DemandeStatus.SOUMISE,
            },
          },
        }),
      );
    });

    it('should throw BadRequestException for an invalid transition', async () => {
      await expect(
        service.changeStatus('dem-1', DemandeStatus.VALIDEE),
      ).rejects.toThrow(BadRequestException);

      expect(mockAuditService.log).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should soft delete and log DELETED action', async () => {
      await service.softDelete('dem-1');

      expect(mockRepository.softDelete).toHaveBeenCalledWith('dem-1');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETED' }),
      );
    });

    it('should throw NotFoundException if demande does not exist', async () => {
      mockRepository.findById.mockRejectedValueOnce(new NotFoundException());

      await expect(service.softDelete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
