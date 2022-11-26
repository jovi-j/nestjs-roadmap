import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDateString(): string {
    return new Date().toLocaleDateString('BR');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
