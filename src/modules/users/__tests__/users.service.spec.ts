import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserRepository } from '../user.repository';
import { UserEntity } from '../user.entity';

const mockUser = new UserEntity({
  id: 'uuid-1',
  name: 'Alice Martin',
  email: 'alice.martin@demo.com',
  createdAt: new Date('2024-01-01'),
});

const mockUserRepository = {
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findById: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return an array of user response DTOs', async () => {
      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'uuid-1',
        name: 'Alice Martin',
        email: 'alice.martin@demo.com',
      });
      // Dates must be ISO strings in the response
      expect(typeof result[0].createdAt).toBe('string');
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a single user response DTO', async () => {
      const result = await service.findById('uuid-1');

      expect(result.id).toBe('uuid-1');
      expect(result.name).toBe('Alice Martin');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('uuid-1');
    });

    it('should propagate NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockRejectedValueOnce(
        new NotFoundException('Utilisateur introuvable'),
      );

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
