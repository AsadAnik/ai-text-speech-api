import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
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
  async login(@Body() loginData: any): Promise<Observable<any>> {

    try {
      const response = await this.authClient.send({ cmd: 'login' }, loginData).toPromise();
      console.log('Login Data: ', response);
      return response;

    } catch (error) {
      // Return a custom error message
      throw new HttpException('Auth service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Route for fetching user profile (calls User Service)
  // region User Profile Service
  @Get('profile')
  async getProfileById(@Body() userId: number): Promise<Observable<any>> {
    try {
      const response = await this.userClient.send({ cmd: 'get_user_profile' }, userId).toPromise();
      console.log('Profile Data: ', response);
      return response;

    } catch (error) {
      // Return a custom error message
      throw new HttpException('Auth service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
