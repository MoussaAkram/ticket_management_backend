import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { UserEntity } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all users ordered by name ascending.
   */
  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
    return users.map((user) => UserMapper.toEntity(user));
  }

  /**
   * Returns a single user by id.
   * Throws NotFoundException if the user does not exist.
   */
  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur "${id}" introuvable`);
    }

    return UserMapper.toEntity(user);
  }
}
