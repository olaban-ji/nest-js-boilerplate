import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any): Promise<ApiResponse<any>> {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Login Successful',
      data: { accessToken: access_token, refreshToken: refresh_token },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() body: any): Promise<ApiResponse<any>> {
    const { refreshToken } = body;
    const { access_token, refresh_token } =
      await this.authService.refresh(refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens refreshed',
      data: { accessToken: access_token, refreshToken: refresh_token },
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<ApiResponse<any>> {
    const { email } = body;
    await this.authService.forgotPassword(email);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset email sent',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto, description: 'Reset password data' })
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<ApiResponse<any>> {
    const { resetToken, newPassword, confirmPassword } = body;
    await this.authService.resetPassword(
      resetToken,
      newPassword,
      confirmPassword,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successful',
    };
  }
}
