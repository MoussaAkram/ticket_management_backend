import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from './user.entity';
import { UserResponse } from './dto/response/user.response';

export class UserMapper {
  /**
   * Converts a Prisma User record to a UserEntity.
   */
  static toEntity(prismaUser: PrismaUser): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      createdAt: prismaUser.createdAt,
    });
  }

  /**
   * Converts a UserEntity to a UserResponse.
   */
  static toResponseDto(entity: UserEntity): UserResponse {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
