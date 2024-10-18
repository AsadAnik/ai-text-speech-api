import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('api')
export class ApiGatewayController {
  private authClient: ClientProxy;
  private userClient: ClientProxy;

  constructor(private readonly apiGatewayService: ApiGatewayService) {
    // region Auth-Service Client
    this.authClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
    });

    // region User-Service Client
    this.userClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }
  // region Send to Auth-Service
  @Get('login')
  login(): Observable<any> {
    return this.authClient.send({ cmd: 'login' }, { username: 'john', password: 'changeme' });
  }

  // region Send to User-Service
  @Get('profile')
  profile(): Observable<any> {
    return this.userClient.send({ cmd: 'profile' }, { userId: '1' });
  }
}
