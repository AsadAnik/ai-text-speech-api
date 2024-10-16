import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  // Handle login reguest from API gateway..
  // region Handle Login Request
  @MessagePattern({ cmd: 'login' })
  async login(data: { userId: number; password: string }) {
    // Simulate login and return JWT token
    return { token: 'JWT-TOKEN', userId: data.userId };
  }
}
