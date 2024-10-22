import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "@app/shared";
import { LoginUserDto } from "@app/shared";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  //  region register service
  async register(body: any): Promise<User> {
    const { email, username, password, first_name, last_name, image_file } = body;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = this.userRepository.create({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
      image_url: image_file || 'default.png', // Handle optional image
    });

    // Save the user to the database
    return await this.userRepository.save(newUser);
  }

  // region login service
  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    // Here, you would generate a token (JWT, for example)
    // For simplicity, we're just returning a mock token
    return { token: Math.random.toString() }; // Replace with actual token generation logic
  }

  getHello(): string {
    return "Hello World!";
  }

  getTest(): { message: string } {
    return {
      message: "Hello Test",
    };
  }

 
}
