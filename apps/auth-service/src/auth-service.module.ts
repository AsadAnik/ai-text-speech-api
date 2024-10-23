import { Module } from "@nestjs/common";
import { AuthServiceController } from "./auth-service.controller";
import { AuthServiceService } from "./auth-service.service";
import { RmqModule, DatabaseModule } from "@app/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: "./apps/auth-service/.env",
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key", // Ensure the secret is provided
      signOptions: { expiresIn: "1h" },
    }),
    RmqModule,
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
