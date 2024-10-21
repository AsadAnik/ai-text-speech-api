import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { ClientProxy, MessagePattern, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller('user')
export class UserServiceController {
  private authClient: ClientProxy;

  constructor(private readonly userServiceService: UserServiceService, private readonly rmqService: RmqService) {
    this.authClient = ClientProxyFactory.create(this.rmqService.getOptions('auth_queue', true));
  }

  @Get('profile')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @Get('verify-me')
  verifyMe() {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Send the message to the auth service
    return this.authClient.send({ cmd: 'verify-me' }, { user });
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

  @MessagePattern({cmd: 'test'})
  test(data: unknown) {
    return data;
  }

}
