import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserResponseDto,
  GetProfileResponseDto,
} from './dto/responses.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() user: CreateUserDto) {
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
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully',
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
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
