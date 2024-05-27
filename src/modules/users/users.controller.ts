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
      const newUser = await this.usersService.create(user);

      return {
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    try {
      return {
        message: 'Profile fetched successfully',
        data: req.user,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
}
