import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RmqService } from '@app/common';
// import * as amqp from 'amqp-connection-manager';

@Controller('api')
export class ApiGatewayController {
  private authClient: ClientProxy;
  private userClient: ClientProxy;

  constructor(private readonly apiGatewayService: ApiGatewayService, private readonly rmqService: RmqService) {
    // region RMQ Connection Manager
    // const rmqConnection = amqp.connect(['amqp://guest:guest@rabbitmq:5672'], {
    //   heartbeatIntervalInSeconds: 10, // Regular heartbeat to keep connection alive
    //   reconnectTimeInSeconds: 5, // Reconnect after 5 seconds on failure
    // });

    // region Auth-Service Client
    // this.authClient = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: ['amqp://localhost:5672'],
    //     queue: 'auth_queue',
    //     queueOptions: { durable: false },
    //     // connection: rmqConnection,
    //     // retryAttempts: 5, // Retry logic in case in failure
    //     // retryDelay: 3000, // Retry every 3 seconds
    //   },
    // } as any);
    this.authClient = ClientProxyFactory.create(this.rmqService.getOptions('auth_queue', true));

    // region User-Service Client
    // this.userClient = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: ['amqp://localhost:5672'],
    //     queue: 'user_queue',
    //     queueOptions: {
    //       durable: false,
    //     },
    //     // connection: rmqConnection,
    //     // retryAttempts: 5, // Retry logic in case in failure
    //     // retryDelay: 3000, // Retry every 3 seconds
    //   },
    // } as any);
  }

  // region Send to Auth-Service
  @Get('login')
  login(): Observable<any> {
    return this.authClient.send({ cmd: 'login' }, { username: 'john', password: 'changeme' });
  }

  // region Send to User-Service
  // @Get('profile')
  // profile(): Observable<any> {
  //   return this.userClient.send({ cmd: 'profile' }, { userId: '1' });
  // }
}
