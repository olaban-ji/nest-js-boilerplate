import { EventSubscriber, EntityName, EventArgs } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { normalizeUserFields } from 'src/common/utils/user.util';

@Injectable()
export class UsersSubscriber implements EventSubscriber<User> {
  constructor(private readonly configService: ConfigService) {}

  getSubscribedEntities(): EntityName<User>[] {
    return [User];
  }

  async beforeCreate(args: EventArgs<User>) {
    const user = args.entity;

    this.normalizeFields(user);

    await this.hashPassword(user);
  }

  async beforeUpdate(args: EventArgs<User>) {
    const user = args.entity;

    this.normalizeFields(user);

    if (this.isPasswordModified(user)) {
      await this.hashPassword(user);
    }
  }

  private normalizeFields(user: User) {
    normalizeUserFields(user);
  }

  private isPasswordModified(user: User): boolean {
    const originalData = (user as any).__helper?.__originalEntityData;

    if (!originalData) return true;

    return user.password !== originalData.password;
  }

  private async hashPassword(user: User) {
    const saltRounds = this.configService.get<number>('auth.saltRounds');
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
}
