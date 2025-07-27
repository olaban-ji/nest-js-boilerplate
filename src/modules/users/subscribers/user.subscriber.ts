import { EventSubscriber, EntityName, EventArgs } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserRoleEnum } from 'src/common/enums';
import * as bcrypt from 'bcrypt';

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
    if (user.email) {
      user.email = user.email.toLowerCase().trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new Error('Invalid email format');
      }
    }

    const trimFields: (keyof User)[] = [
      'avatar',
      'firstName',
      'lastName',
      'address',
      'city',
      'postalCode',
      'state',
      'country',
      'countryCode',
      'phoneNumber',
    ];

    trimFields.forEach((field) => {
      const value = user[field];
      if (value && typeof value === 'string') {
        (user[field] as any) = value.trim();
      }
    });

    if (user.role) {
      user.role = user.role.toLowerCase() as UserRoleEnum;
    }
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
