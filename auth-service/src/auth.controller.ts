import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  // Handle login request from API Gateway
  // region Handle Login Request
  @MessagePattern({ cmd: 'login' })
  async login(data: { userId: number; password: string }) {
    // Simulate login and return JWT token
    console.log('Login Application here - ', data);
    return { token: 'JWT-TOKEN', userId: data.userId };
  }
}
