import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.contoller';

@Module({
  controllers: [ApiGatewayController],
})
export class AppModule {}
