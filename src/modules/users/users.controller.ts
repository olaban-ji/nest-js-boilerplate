import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('sign-up')
  async create(@Body() user: any) {
    try {
      return await this.userService.create(user);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('profile')
  async getProfile() {
    try {
      return 'Profile';
    } catch (error) {
      console.log(error);
    }
  }
}
