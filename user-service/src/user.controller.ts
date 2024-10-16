import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  // Handle fetching user profile from API Gateway
  // region Handle Profile Request
  @MessagePattern({ cmd: 'get_user_profile' })
  getUserProfile(userId: number) {
    // Simulate user profile
    return { userId, name: 'John Doe', email: 'johndoe@example.com' };
  }
}
