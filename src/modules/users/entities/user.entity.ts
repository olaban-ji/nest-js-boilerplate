import {
  Entity,
  Property,
  Enum,
  BeforeCreate,
  BeforeUpdate,
  Index,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entitiy';
import { UserRoleEnum } from 'src/common/enums';
import { normalizeUserFields } from 'src/common/utils/user.util';

@Entity({ tableName: 'users' })
@Index({ properties: ['email'] })
export class User extends BaseEntity {
  @Property({
    unique: true,
    type: 'varchar',
    length: 255,
    comment: 'User email address',
  })
  email!: string;

  @Property({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Avatar URL or path',
  })
  avatar?: string;

  @Property({
    type: 'varchar',
    length: 100,
    comment: 'User first name',
  })
  firstName!: string;

  @Property({
    type: 'varchar',
    length: 100,
    comment: 'User last name',
  })
  lastName!: string;

  @Property({
    type: 'text',
    nullable: true,
    comment: 'Street address',
  })
  address?: string;

  @Property({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'City name',
  })
  city?: string;

  @Property({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Postal/ZIP code',
  })
  postalCode?: string;

  @Property({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'State/Province',
  })
  state?: string;

  @Property({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Country name',
  })
  country?: string;

  @Property({
    type: 'varchar',
    length: 3,
    nullable: true,
    comment: 'ISO country code',
  })
  countryCode?: string;

  @Property({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Phone number',
  })
  phoneNumber?: string;

  @Property({
    type: 'varchar',
    length: 255,
    comment: 'Hashed password',
  })
  password!: string;

  @Enum({
    items: () => UserRoleEnum,
    type: 'varchar',
    length: 20,
    default: UserRoleEnum.USER,
    comment: 'User role',
  })
  role: UserRoleEnum = UserRoleEnum.USER;

  @Property({
    type: 'boolean',
    default: false,
    comment: 'Whether user needs to change password',
  })
  changePassword: boolean = false;

  @Property({
    type: 'boolean',
    default: false,
    comment: 'Whether password reset was requested',
  })
  passwordResetRequested: boolean = false;

  @Property({
    type: 'timestamptz',
    nullable: true,
    comment: 'Last login timestamp',
  })
  lastLoggedIn?: Date;

  @BeforeCreate()
  @BeforeUpdate()
  private normalizeFields() {
    normalizeUserFields(this);
  }
}
