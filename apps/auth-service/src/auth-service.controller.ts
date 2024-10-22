import { Body, Controller, Post } from "@nestjs/common";
import { AuthServiceService } from "./auth-service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";

@Controller("auth")
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  /**
   * REGISTER USER CONTROLLER
   * @param body 
   * @returns 
   */
  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<{}> {
    try {
      const { first_name, last_name, email, username, password, image_file } = body;

      if (!email || !username || !password) {
        throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.authServiceService.register({
        first_name,
        last_name,
        email,
        username,
        password,
        image_file,
      });

      return {
        status: 201,
        success: true,
        message: 'User is Registered!',
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          image_url: newUser.image_url || 'default.png', // Handle optional image URL
          created_at: newUser.created_at.getTime(),
          updated_at: newUser.updated_at.getTime(),
        },
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * LOGIN USER CONTROLLER
   * @param loginUserDto 
   * @returns 
   */
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authServiceService.login(loginUserDto);
    return {
      status: 200,
      message: 'Login successful!',
      token,
    };
  }

  // region Message Receive Login
  // @MessagePattern({ cmd: "verify-me" })
  // login(user: any) {
  //   return {
  //     token: "token",
  //     user,
  //   };
  // }

}
