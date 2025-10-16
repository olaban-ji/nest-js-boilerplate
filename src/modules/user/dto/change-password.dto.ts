import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The new password for the user. Minimum of 10 characters.',
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
  newPassword: string;

  @ApiProperty({
    description: 'The confirmation of the new password',
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
  confirmPassword: string;
}
