import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared';
import { Repository } from 'typeorm';

@Controller("auth")
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService, 
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Get("login")
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Post('register')
  async register(@Body() userData: {}): Promise<User> {
    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);

    } catch(error) {
      console.log('REGISTER ERROR - ', error.message);
    }
  }

  @MessagePattern({ cmd: 'login' })
  loginApiGateWay(user: any) {
    return {
      token: "token",
      user,
      message: "i am new here",
    };
  }

  // region Message Receive Login
  @MessagePattern({ cmd: "verify-me" })
  login(user: any) {
    return {
      token: "token",
      user,
    };
  }

  // region test route
  @Get("test")
  test() {
    return this.userClient.send(
      { cmd: "test" },
      { firstname: "armaan", degree: "ssc" }
    );
  }
  
}
