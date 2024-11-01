import { Body, Controller, Post, Query } from "@nestjs/common";
import { AuthServiceService } from "./auth-service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { VerifyUserBodyDto, VerifyUserQueryDto } from "@app/shared";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Authentication')
@Controller("auth")
export class AuthServiceController {
  private userClient: ClientProxy;

  constructor(
    private readonly authServiceService: AuthServiceService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }


  /**
   * REGISTER USER CONTROLLER
   * @param body 
   * @returns 
   */
  // region: Register User
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<any> {
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
          id: newUser?.id,
          username: newUser?.username,
          email: newUser?.email,
          image_url: newUser?.image_url || 'default.png', // Handle optional image URL
          created_at: newUser?.created_at.getTime(),
          updated_at: newUser?.updated_at.getTime(),
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
  // region: Login User
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      const loginData = await this.authServiceService.login(loginUserDto);

      return {
        status: 200,
        success: true,
        message: 'Logged in successfully!',
        data: {
          id: loginData.id,
          username: loginData.username,
          email: loginData.email,
          image_url: loginData.image_url,
          created_at: loginData.created_at.getTime(),
          updated_at: loginData.updated_at.getTime(),
          accessToken: loginData.accessToken
        }
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * VERIFY USER CONTROLLER
   * @param body 
   * @param query 
   */
  // region: Verify User
  @ApiOperation({ summary: 'Verify user account' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('verify')
  async verify(@Body() body: VerifyUserBodyDto, @Query() query: VerifyUserQueryDto): Promise<any> {
    const { usernameOrEmail } = body;
    const { verifyCode } = query;

    try {
      // This is where we will verify the user
      const user = await this.authServiceService.emailOrUsernameExists(usernameOrEmail);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Verify User Service Method
      await this.authServiceService.verifyUser(user, verifyCode);

      return {
        status: 200,
        success: true,
        message: 'User verified successfully!',
        data: {
          id: user.id,
          email: user.email,
          is_verified: user.is_verified,
          created_at: user.created_at.getTime(),
          updated_at: user.updated_at.getTime(),
        }
      };
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
