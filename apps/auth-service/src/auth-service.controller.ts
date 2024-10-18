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

  // region Message Receive Login
  @MessagePattern({ cmd: 'login' })
  login(data: any) {
    return {
      token: 'token',
      data
    };
  }
}
