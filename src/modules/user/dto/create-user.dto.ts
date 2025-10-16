import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRoleEnum } from '@common/enums';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Springfield',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The city of the user',
    example: 'Springfield',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'The postal code of the user',
    example: '12345',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'The state of the user',
    example: 'Illinois',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'The country of the user',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'The country code of the user',
    example: '+1',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const cleaned = value.replace(/\+/g, '');
    return cleaned ? `+${cleaned}` : '';
  })
  countryCode?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Strong.Pass-1',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{10,}$/,
    {
      message:
        'Password must be at least 10 characters long and include uppercase, lowercase, and a symbol (e.g. @, #, ., -)',
    },
  )
  @MinLength(10)
  password: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    example: UserRoleEnum.USER,
    enum: UserRoleEnum,
  })
  @IsEnum(UserRoleEnum, {
    message: `role must be one of: ${Object.values(UserRoleEnum).join(', ')}`,
  })
  @IsOptional()
  role: UserRoleEnum;

  @IsBoolean()
  @IsOptional()
  changePassword?: boolean;
}
