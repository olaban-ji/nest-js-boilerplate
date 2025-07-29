import { UserRoleEnum } from 'src/common/enums';
import { User } from 'src/modules/users/entities/user.entity';

export function normalizeUserFields(user: User): void {
  if (user.email) {
    user.email = user.email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new Error('Invalid email format');
    }
  }

  const trimFields: (keyof Pick<
    User,
    | 'avatar'
    | 'firstName'
    | 'lastName'
    | 'address'
    | 'city'
    | 'postalCode'
    | 'state'
    | 'country'
    | 'countryCode'
    | 'phoneNumber'
  >)[] = [
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
    if (user[field] && typeof user[field] === 'string') {
      user[field] = user[field].trim();
    }
  });

  if (user.role) {
    user.role = user.role.toLowerCase() as UserRoleEnum;
  }
}
