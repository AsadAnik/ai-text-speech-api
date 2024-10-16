import { Controller, Post, Get, Body } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('api')
export class ApiGatewayController {
  // Client for Auth Service
  // region Auth Service Client
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  })
  private authClient: ClientProxy;

  // Client for User Service
  // region User Service Client
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  })
  private userClient: ClientProxy;

  // Route for user login (calls Auth Service)
  // region Auth Login Service
  @Post('login')
  login(@Body() loginData: any): Observable<any> {
    return this.authClient.send({ cmd: 'login' }, loginData);
  }

  // Route for fetching user profile (calls User Service)
  // region User Profile Service
  @Get('profile')
  getProfileById(@Body() userId: number): Observable<any> {
    return this.userClient.send({ cmd: 'get_user_profile' }, userId);
  }
}
