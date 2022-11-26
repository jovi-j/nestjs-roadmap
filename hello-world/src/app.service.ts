import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDate(): string {
    return new Date().toLocaleDateString('BR');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
