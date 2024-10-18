import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get('profile')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  // region Message Receive Profile
  @MessagePattern({ cmd: 'profile' })
  getProfile(data: any) {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      data
    };
  }
}
