import { Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { UsersService } from 'src/modules/users/users.service';
import { Option } from 'nest-commander';
import chalk from 'chalk';
import { UserRoleEnum } from 'src/common/enums';
import { customAlphabet } from 'nanoid';
import { PASSWORD_CHARACTER_SET } from 'src/common/constants';
import { EntityManager } from '@mikro-orm/core';

@Command({ name: 'create:user', description: 'Create a new user' })
@Injectable()
export class CreateUserCommand extends CommandRunner {
  private readonly nanoid = customAlphabet(PASSWORD_CHARACTER_SET, 10);

  constructor(
    private readonly em: EntityManager,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const { email, firstName, lastName, role } = options;

    const forkedEm = this.em.fork();

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      await forkedEm.transactional(async () => {
        await this.usersService.create({
          email,
          firstName,
          lastName,
          password: this.nanoid(),
          role,
        });
      });
      console.log(chalk.green.bold(`✅ Created user with email: ${email}`));
    } catch (error) {
      console.error(
        chalk.red.bold(`❌ Failed to create user: ${error.message}`),
      );
    }
  }

  @Option({ flags: '-e, --email <email>', required: true }) parseEmail(
    val: string,
  ) {
    return val;
  }

  @Option({ flags: '-f, --first-name <name>', required: true }) parseFirstName(
    val: string,
  ) {
    return val;
  }

  @Option({ flags: '-l, --last-name <name>', required: true }) parseLastName(
    val: string,
  ) {
    return val;
  }

  @Option({ flags: '-r, --role <role>', required: true }) parseRole(
    val: string,
  ) {
    return val as UserRoleEnum;
  }
}
