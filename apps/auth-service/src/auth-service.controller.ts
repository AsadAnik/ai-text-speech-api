import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthServiceService } from "./auth-service.service";
import { Client,ClientProxy, MessagePattern,ClientProxyFactory} from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { Repository } from "typeorm";
import { CreateUserDto } from "@app/shared";
import { LoginUserDto } from "@app/shared";
import  { HttpException, HttpStatus } from "@nestjs/common";
import { RmqService } from '@app/common';


@Controller("api/auth")
export class AuthServiceController {
  private userClient: ClientProxy;

  constructor(
   
    private readonly authServiceService: AuthServiceService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rmqService: RmqService
  ) {
    this.userClient = ClientProxyFactory.create(
      this.rmqService.getOptions("auth_queue", true)
    )
  }

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   const newUser = await this.authServiceService.register(createUserDto);
  //   return {
  //     status: 201,
  //     message: 'User registered successfully!',
  //     data: newUser,
  //   };
  // }

   // region register controller
   @Post('register')
   async register(@Body() body: any) {
     const { first_name, last_name, email, username, password, image_file } = body;
 
     if (!first_name || !last_name || !email || !username || !password) {
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
   }

  //  region login controller
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authServiceService.login(loginUserDto);
    return {
      status: 200,
      message: 'Login successful!',
      token,
    };
  }

  @Get("login")
  getHello(): string {
    return this.authServiceService.getHello();
  }

  // @Post("register")
  // async register(@Body() userData: {}): Promise<User> {
  //   try {
  //     const newUser = this.userRepository.create(userData);
  //     return await this.userRepository.save(newUser);
  //   } catch (error) {
  //     console.log("REGISTER ERROR - ", error.message);
  //   }
  // }

  @MessagePattern({ cmd: "login" })
  loginApiGateWay(user: any) {
    return {
      token: "token",
      user,
      message: "i am new here",
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

  // region test route
  @Get("test")
  test() {
    return this.userClient.send(
      { cmd: "test" },
      { firstname: "armaan", degree: "ssc" }
    );
  }

 
}
