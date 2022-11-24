import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/admin')
  @Redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 301)
  getAdmin() {}
}
