import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() user: CreateUserDto): Promise<ApiResponse<any>> {
    const newUser = await this.usersService.create(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    };
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req: any): Promise<ApiResponse<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = req.user;

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile fetched successfully',
      data: { user: safeUser },
    };
  }
}
