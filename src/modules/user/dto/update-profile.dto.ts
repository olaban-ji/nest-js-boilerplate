import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, [
    'role',
    'email',
    'password',
    'phoneNumber',
    'countryCode',
  ] as const),
) {}
