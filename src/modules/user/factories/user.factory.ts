import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '../entities/user.entity';
import { UserRoleEnum } from '@common/enums';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      state: faker.location.state(),
      country: faker.location.country(),
      countryCode: faker.location.countryCode(),
      phoneNumber: faker.phone.number(),
      role: faker.helpers.enumValue(UserRoleEnum),
    };
  }
}
