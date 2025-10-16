import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityData,
  EntityRepository,
  FilterQuery,
  FindOneOrFailOptions,
} from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AppRedisService } from '@services/redis/redis.service';

@Injectable()
export class UserService {
  private readonly userIdCacheKey: string;
  private readonly userEmailCacheKey: string;

  constructor(
    private readonly appRedisService: AppRedisService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    this.userIdCacheKey = `users:id`;
    this.userEmailCacheKey = `users:email`;
  }

  async create(userData: any): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      email: userData.email,
    });

    if (user) {
      throw new ConflictException('User already exists in the system.');
    }

    const newUser = this.userRepository.create(userData);
    await this.userRepository.getEntityManager().persistAndFlush(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
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
      if ('id' in query && query?.id) {
        cacheKey = `${this.userIdCacheKey}:${query?.id}`;
      } else if ('email' in query && query?.email) {
        cacheKey = `${this.userEmailCacheKey}:${query?.email}`;
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

    const user = await this.userRepository.findOneOrFail(query, options);

    if (cacheKey) {
      const serializable = { ...user };

      await Promise.all([
        this.appRedisService.set(
          `${this.userIdCacheKey}:${user?.id}`,
          JSON.stringify(serializable),
          5 * 60,
        ),
        this.appRedisService.set(
          `${this.userEmailCacheKey}:${user?.email}`,
          JSON.stringify(serializable),
          5 * 60,
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

    this.userRepository.assign(user, data);

    await this.userRepository.getEntityManager().persistAndFlush(user);

    if (user) {
      await Promise.all([
        this.appRedisService.set(
          `${this.userIdCacheKey}:${user?.id}`,
          JSON.stringify(user),
          5 * 60,
        ),
        this.appRedisService.set(
          `${this.userEmailCacheKey}:${user?.email}`,
          JSON.stringify(user),
          5 * 60,
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

    const user = await this.userRepository.findOneOrFail(
      { id: userId },
      { failHandler: () => new NotFoundException('User not found') },
    );

    if (user?.changePassword === false) {
      throw new BadRequestException(
        'Password change is not allowed for this user',
      );
    }

    const updatedUser = await this.update({
      id: userId,
      password: newPassword,
      changePassword: false,
    });

    return updatedUser;
  }
}
