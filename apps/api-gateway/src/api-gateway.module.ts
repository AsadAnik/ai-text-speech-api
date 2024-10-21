import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema:  Joi.object({
      //   RABBIT_MQ_URI: Joi.string().required(),
      //   RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      // }),
      // envFilePath: './apps/api-gateway/.env',
    }),
    RmqModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
