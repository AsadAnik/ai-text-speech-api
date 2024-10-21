import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  getTest(): {message: string} {
    return {
      message: 'Hello Test',
    }
  }
}
