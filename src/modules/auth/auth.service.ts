import bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JsonWebTokenError, JwtService, NotBeforeError } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { PASSWORD_RESET_EMAIL_QUEUE_NAME } from 'src/common/constants';
import { Queue } from 'bullmq';
import { AuthTokens } from './types/auth-tokens';
import { AppRedisService } from 'src/services/redis/redis.service';
import moment from 'moment';
import { parseTimeString } from 'src/common/utils/time.utils';

@Injectable()
export class AuthService {
  private readonly passwordResetUrl: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtNotBefore: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpriresIn: string;
  private readonly saltRounds: number;

  constructor(
    private readonly appRedisService: AppRedisService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectQueue(PASSWORD_RESET_EMAIL_QUEUE_NAME)
    private readonly passwordResetEmailQueue: Queue,
  ) {
    this.passwordResetUrl =
      this.configService.getOrThrow<string>('url.passwordReset');
    this.jwtExpiresIn = this.configService.getOrThrow('auth.jwt.expiresIn');
    this.jwtNotBefore = `${parseInt(this.jwtExpiresIn) - 1}m`;
    this.jwtRefreshExpriresIn = this.configService.getOrThrow<string>(
      'auth.jwt.refreshExpiresIn',
    );
    this.jwtRefreshSecret = this.configService.getOrThrow<string>(
      'auth.jwt.refreshSecret',
    );
    this.saltRounds = this.configService.getOrThrow<number>('auth.saltRounds');
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpriresIn,
        notBefore: this.jwtNotBefore,
      }),
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: any;

    const cacheKey = `tokens:refresh:blacklisted:${refreshToken}`;
    const isBlacklisted = await this.appRedisService.exists(cacheKey);
    if (isBlacklisted) {
      throw new BadRequestException('Refresh token is blacklisted');
    }

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtRefreshSecret,
      });
    } catch (error) {
      if (
        error instanceof JsonWebTokenError &&
        error.message === 'jwt malformed'
      ) {
        throw new BadRequestException('Malformed refresh token');
      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException('Refresh token not active yet');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne({
      id: payload.sub,
    });

    if (!user) throw new NotFoundException('User not found');

    const newPayload = {
      sub: user.id,
    };

    const { value, unit } = parseTimeString(this.jwtRefreshExpriresIn);

    await this.appRedisService.set(
      cacheKey,
      '1',
      moment.duration(value, unit).asSeconds() + 60,
    );

    return {
      access_token: this.jwtService.sign(newPayload),
      refresh_token: this.jwtService.sign(newPayload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpriresIn,
        notBefore: this.jwtNotBefore,
      }),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });

    const resetUrl = `${this.passwordResetUrl}?reset-token=${token}`;

    await this.passwordResetEmailQueue.add('send-password-reset-email', {
      email: user.email,
      firstName: user.firstName,
      resetUrl,
    });

    await this.usersService.update({
      id: user.id,
      passwordResetRequested: true,
    });
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const payload = this.jwtService.verify(resetToken);
    const user = await this.usersService.findOne({
      email: payload.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordResetRequested) {
      throw new NotFoundException('Password reset not requested');
    }

    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.usersService.update({
      id: user.id,
      password: hashedPassword,
      passwordResetRequested: false,
    });
  }
}
