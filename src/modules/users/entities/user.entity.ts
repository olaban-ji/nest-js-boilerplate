import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  BeforeCreate,
  BeforeUpdate,
  Index,
} from '@mikro-orm/core';
import { UserRoleEnum } from 'src/common/enums';
import { v7 as uuidv7 } from 'uuid';

@Entity({ tableName: 'users' })
@Index({ properties: ['email'] })
@Index({ properties: ['deletedAt'] })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7();

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

  @Property({
    type: 'timestamptz',
    nullable: true,
    comment: 'Soft delete timestamp',
  })
  deletedAt?: Date;

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: 'Record creation timestamp',
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
    comment: 'Record last update timestamp',
  })
  updatedAt: Date = new Date();

  @BeforeCreate()
  @BeforeUpdate()
  private normalizeFields() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        throw new Error('Invalid email format');
      }
    }

    const trimFields = [
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
      if (
        this[field as keyof this] &&
        typeof this[field as keyof this] === 'string'
      ) {
        (this[field as keyof this] as any) = (
          this[field as keyof this] as string
        ).trim();
      }
    });

    if (this.role) {
      this.role = this.role.toLowerCase() as UserRoleEnum;
    }
  }
}
