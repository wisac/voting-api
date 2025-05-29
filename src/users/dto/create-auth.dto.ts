import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
   @ApiProperty({ example: 'user@example.com', description: 'User email address' })
   @IsEmail()
   email: string;

   @ApiProperty({ example: 'strongPassword123', description: 'User password' })
      @IsString()
   password: string;
}
