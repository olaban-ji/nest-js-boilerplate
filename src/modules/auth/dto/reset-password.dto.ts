import { ApiProperty } from '@nestjs/swagger';
import {
  IsJWT,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password for the user',
    example: 'Asecure-Word.',
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
    example: 'Asecure-Word.',
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

  @ApiProperty({
    description: 'The reset token sent to the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsJWT()
  @IsNotEmpty()
  resetToken: string;
}
