import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityData,
  EntityRepository,
  FilterQuery,
  FindOneOrFailOptions,
  NotFoundError,
} from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import bcrypt from 'bcrypt';
import { AppRedisService } from 'src/services/redis/redis.service';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;
  private readonly userIdCacheKey: string;
  private readonly userEmailCacheKey: string;

  constructor(
    private readonly appRedisService: AppRedisService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    this.saltRounds = this.configService.getOrThrow<number>('auth.saltRounds');
    this.userIdCacheKey = `users:id`;
    this.userEmailCacheKey = `users:email`;
  }

  async create(userData: any): Promise<Omit<User, 'password'>> {
    try {
      await this.userRepository.findOneOrFail({
        email: userData.email,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
      }
    }

    const user = this.userRepository.create(userData);
    await this.userRepository.getEntityManager().persistAndFlush(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findOne(
    query: FilterQuery<User>,
    options?: FindOneOrFailOptions<User>,
  ): Promise<User> {
    let cacheKey: string | undefined;

    if (typeof query === 'string') {
      cacheKey = `${this.userIdCacheKey}:${query}`;
    } else if (typeof query === 'object' && query !== null) {
      if ('id' in query && query.id) {
        cacheKey = `${this.userIdCacheKey}:${query.id}`;
      } else if ('email' in query && query.email) {
        cacheKey = `${this.userEmailCacheKey}:${query.email}`;
      }
    }

    if (cacheKey) {
      const cached = await this.appRedisService.get(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        const user = this.userRepository.create(parsed);
        return this.userRepository.getEntityManager().merge(user);
      }
    }

    const user = await this.userRepository.findOne(query, options);

    if (cacheKey) {
      const serializable = { ...user };

      await Promise.all([
        this.appRedisService.set(
          `${this.userIdCacheKey}:${user.id}`,
          JSON.stringify(serializable),
          24 * 60 * 60,
        ),
        this.appRedisService.set(
          `${this.userEmailCacheKey}:${user.email}`,
          JSON.stringify(serializable),
          24 * 60 * 60,
        ),
      ]);
    }

    return user;
  }

  async update(data: EntityData<User>): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneOrFail(
      { id: data.id },
      { failHandler: () => new NotFoundException('User not found') },
    );

    Object.assign(user, data);

    await this.userRepository.getEntityManager().flush();

    if (user) {
      await Promise.all([
        this.appRedisService.set(
          `${this.userIdCacheKey}:${user?.id}`,
          JSON.stringify(user),
          24 * 60 * 60,
        ),
        this.appRedisService.set(
          `${this.userEmailCacheKey}:${user?.email}`,
          JSON.stringify(user),
          24 * 60 * 60,
        ),
      ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async changePassword(
    userId: string,
    data: ChangePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await this.update({
      id: userId,
      password: hashedPassword,
      changePassword: false,
    });

    return updatedUser;
  }
}
