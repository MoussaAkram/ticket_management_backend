import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResponse } from './dto/response/user.response';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Returns all users as response DTOs.
   */
  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toResponseDto(user));
  }

  /**
   * Returns a single user as a response DTO.
   * Propagates NotFoundException if the user does not exist.
   */
  async findById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    return UserMapper.toResponseDto(user);
  }
}
