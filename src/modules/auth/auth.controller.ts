import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req: any) {
    try {
      const { access_token } = await this.authService.login(req.user);
      return {
        message: 'Login Successful',
        data: { accessToken: access_token },
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}
