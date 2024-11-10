import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import {
  ClientProxy,
  MessagePattern,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserServiceController {
  private authClient: ClientProxy;

  constructor(
    private readonly userServiceService: UserServiceService,
    private readonly rmqService: RmqService,
  ) {
    this.authClient = ClientProxyFactory.create(
      this.rmqService.getOptions('auth_queue', true),
    );
  }

  @Get('profile')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @Get('own-profile')
  async getOwnProfile(@Query('userId') userId: string) {
    return this.userServiceService.getOwnProfile(userId);
  }

  @Get('other-profile/:username')
  async getOtherUserProfile(@Param('username') username: string) {
    return this.userServiceService.getOtherUserProfile(username);
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

  //region Receive profile information via message pattern
  @MessagePattern({ cmd: 'profile' })
  getProfile(data: any) {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      data,
    };
  }

  @MessagePattern({ cmd: 'test' })
  test(data: unknown) {
    return data;
  }

  @Put('update-profile/:userId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // limit to 2MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: { name?: string; email?: string },
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.userServiceService.updateUserProfile(userId, updateData, image);
  }
}
