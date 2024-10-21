import { Controller, Get } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get('login')
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @MessagePattern({ cmd: 'login' })
  loginApiGateWay(user: any) {
    return {
      token: 'token',
      user,
      message: 'i am new here',
    };
  }

  // region Message Receive Login
  @MessagePattern({ cmd: 'verify-me' })
  login(user: any) {
    return {
      token: 'token',
      user
    };
  }
}
