import { Migration } from '@mikro-orm/migrations';

export class Migration20250730220636 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "deleted_at" timestamptz null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "email" varchar(255) not null, "avatar" varchar(500) null, "first_name" varchar(100) not null, "last_name" varchar(100) not null, "address" text null, "city" varchar(100) null, "postal_code" varchar(20) null, "state" varchar(100) null, "country" varchar(100) null, "country_code" varchar(3) null, "phone_number" varchar(20) null, "password" varchar(255) not null, "role" text check ("role" in ('admin', 'user')) not null default 'user', "change_password" boolean not null default false, "password_reset_requested" boolean not null default false, "last_logged_in" timestamptz null, constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(
      `comment on column "users"."deleted_at" is 'Soft delete timestamp';`,
    );
    this.addSql(
      `comment on column "users"."created_at" is 'Record creation timestamp';`,
    );
    this.addSql(
      `comment on column "users"."updated_at" is 'Record last update timestamp';`,
    );
    this.addSql(`comment on column "users"."email" is 'User email address';`);
    this.addSql(`comment on column "users"."avatar" is 'Avatar URL or path';`);
    this.addSql(`comment on column "users"."first_name" is 'User first name';`);
    this.addSql(`comment on column "users"."last_name" is 'User last name';`);
    this.addSql(`comment on column "users"."address" is 'Street address';`);
    this.addSql(`comment on column "users"."city" is 'City name';`);
    this.addSql(
      `comment on column "users"."postal_code" is 'Postal/ZIP code';`,
    );
    this.addSql(`comment on column "users"."state" is 'State/Province';`);
    this.addSql(`comment on column "users"."country" is 'Country name';`);
    this.addSql(
      `comment on column "users"."country_code" is 'ISO country code';`,
    );
    this.addSql(`comment on column "users"."phone_number" is 'Phone number';`);
    this.addSql(`comment on column "users"."password" is 'Hashed password';`);
    this.addSql(`comment on column "users"."role" is 'User role';`);
    this.addSql(
      `comment on column "users"."change_password" is 'Whether user needs to change password';`,
    );
    this.addSql(
      `comment on column "users"."password_reset_requested" is 'Whether password reset was requested';`,
    );
    this.addSql(
      `comment on column "users"."last_logged_in" is 'Last login timestamp';`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
    this.addSql(
      `create index "users_deleted_at_index" on "users" ("deleted_at");`,
    );
    this.addSql(`create index "users_email_index" on "users" ("email");`);
  }
}
