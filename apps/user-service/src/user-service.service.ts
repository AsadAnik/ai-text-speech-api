import { Injectable } from '@nestjs/common';
import { User } from '@app/shared';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserServiceService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  getHello(): string {
    return 'Hello World!';
  }

  

  /**
   * UPDATE USER
   * @param user
   * @returns
   */
  public async updateUser(user: User): Promise<User> {
    try {
      const existingUser = await this.findUserById(user.id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      Object.assign(existingUser, user);
      return await this.userRepository.save(existingUser);

    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * FIND USER BY USERNAME
   * @param username
   * @returns
   */
  private async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * FIND USER BY ID
   * @param id
   * @returns
   */
  private async findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
