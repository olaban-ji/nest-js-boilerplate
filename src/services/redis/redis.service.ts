import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppRedisService {
  private readonly appRedis: Redis;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.appRedis = this.redisService.getOrThrow(
      this.configService.getOrThrow<string>('redis.namespace'),
    );
  }

  /**
   * Set a Redis key
   * @param key Redis key
   * @param value Value to store
   * @param ttl Time-to-live in seconds
   * @param nx Set to true to use NX (only set if key does not exist)
   * @returns 'OK' if set successfully, null if not (when NX is used)
   */
  async set(key: string, value: any, ttl?: number, nx: boolean = false) {
    const ttlInfo = ttl ? `TTL: ${ttl}s` : 'no TTL';
    const nxInfo = nx ? 'using NX' : 'without NX';

    this.loggerService.log(
      `Setting key "${key}" (${ttlInfo}, ${nxInfo})`,
      AppRedisService.name,
    );

    const args: (string | number)[] = [key, value];

    if (nx) args.push('NX');
    if (ttl) args.push('EX', ttl);

    return this.appRedis.set(...(args as Parameters<Redis['set']>));
  }

  async get(key: string) {
    const value = await this.appRedis.get(key);

    this.loggerService.log(
      `Getting key "${key}" - ${value ? 'Found' : 'Not Found'}`,
      AppRedisService.name,
    );

    return value;
  }

  async increment(key: string, ttl?: number): Promise<number | unknown> {
    const pipeline = this.appRedis.pipeline();

    if (ttl) {
      pipeline.set(key, 0, 'EX', ttl, 'NX');
    }

    pipeline.incr(key);

    const results = await pipeline.exec();
    const incrResult = results[ttl ? 1 : 0];

    return incrResult[1];
  }

  async decrement(key: string) {
    return this.appRedis.decr(key);
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.appRedis.exists(key);
    this.loggerService.log(
      `Checking existence of key "${key}" - ${exists ? 'Exists' : 'Does not exist'}`,
      AppRedisService.name,
    );
    return exists > 0;
  }

  /**
   * Delete a Redis key
   * @param key Redis key to delete
   * @returns Number of keys deleted (0 or 1)
   */
  async delete(key: string): Promise<number> {
    const result = await this.appRedis.del(key);

    this.loggerService.log(
      `Deleting key "${key}" - ${result > 0 ? 'Deleted' : 'Key not found'}`,
      AppRedisService.name,
    );

    return result;
  }

  /**
   * Delete multiple Redis keys
   * @param keys Array of Redis keys to delete
   * @returns Number of keys deleted
   */
  async deleteMany(keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;

    const result = await this.appRedis.del(...keys);

    this.loggerService.log(
      `Deleting ${keys.length} keys - ${result} deleted`,
      AppRedisService.name,
    );

    return result;
  }
}
