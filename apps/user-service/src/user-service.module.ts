import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared';
import {CloudinaryModule} from "./cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema:  Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/user-service/.env',
    }),
    TypeOrmModule.forFeature([User]),
    RmqModule,
    DatabaseModule,
    CloudinaryModule,
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
  exports: [UserServiceService], // Export if needed in other modules

})
export class UserServiceModule {}
