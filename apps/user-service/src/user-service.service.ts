import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@app/shared";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import * as path from "path";
import { CloudinaryService } from "@app/shared/providers/cloudinary.provider";

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  getHello(): string {
    return "Hello World!";
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
        throw new Error("User not found");
      }

      Object.assign(existingUser, user);
      return await this.userRepository.save(existingUser);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async updateUserProfile(
    userId: string,
    updateData: { name?: string; email?: string },
    image?: Express.Multer.File
  ): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    if (updateData.name) user.first_name = updateData.name;
    if (updateData.email) user.email = updateData.email;

    if (image) {
      // Upload new image to Cloudinary and get the URL
      const imageUrl = await this.cloudinaryService.uploadImage(image);

      // Delete the local image file if saved on the server
      fs.unlinkSync(image.path);

      // Save new image URL to user profile
      user.image_url = imageUrl;
    }

    return this.userRepository.save(user);
  }

  /**
   * GET LOGGED-IN USER PROFILE
   * @param userId
   * @returns
   */
  public async getOwnProfile(userId: string): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  /**
   * GET OTHER USER'S PROFILE
   * @param username
   * @returns
   */
  public async getOtherUserProfile(username: string): Promise<User> {
    const user = await this.findUserByUsername(username);
    if (!user) throw new NotFoundException("User not found");
    return user;
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
