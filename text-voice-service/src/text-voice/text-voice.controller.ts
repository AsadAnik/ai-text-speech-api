import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('text-voice')
export class TextVoiceController {
  // Handle login request from API Gateway
  // region Message Pattern
  @MessagePattern({ cmd: 'get_text_voice' })
  async login(data: { userId: number; }) {
    console.log('Text-Voice Application here - ', data);
    return { message: 'This is Text Voice Application', userId: data.userId };
  }


  // region Event Pattern
  @EventPattern('myEmit')
  all(data: string): any {
    console.log('Text-Voice Application here - ', data);
    return {
        data,
        message: 'This is Text Voice Application',
    };
  }
}
