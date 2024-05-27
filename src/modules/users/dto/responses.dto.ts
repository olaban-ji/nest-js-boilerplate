import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'Message indicating the success of the operation',
    example: 'User created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The newly created user',
    type: User,
  })
  data: User;
}

export class GetProfileResponseDto {
  @ApiProperty({
    description: 'Message indicating the success of the operation',
    example: 'Profile fetched successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The profile of the user',
    type: User,
  })
  data: User;
}
