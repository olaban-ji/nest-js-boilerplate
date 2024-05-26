import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('sign-up')
  async create(@Body() user: any) {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    try {
      return req.user;
    } catch (error) {
      console.log(error);
    }
  }
}
