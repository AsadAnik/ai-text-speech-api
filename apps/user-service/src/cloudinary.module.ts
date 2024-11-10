import { Module } from '@nestjs/common';
import { CloudinaryService } from "@app/shared/providers/cloudinary.provider";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Export so other modules can use it
})
export class CloudinaryModule {}
