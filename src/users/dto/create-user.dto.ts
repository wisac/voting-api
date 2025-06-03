import { IsEmail, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Subsidiary } from 'src/votes/votes.controller';


export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'user'],
    description: 'User role',
  })
  @IsIn(['admin', 'user'])
  role: 'admin' | 'user';

  @ApiProperty({
    example: 'male',
    enum: ['male', 'female'],
    description: 'User gender',
  })
  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({
    example: 'estate-masters',
    enum: ['estate-masters', 'hannex', 'nestas', 'dwellys', 'kasoa'],
    description: 'Subsidiary name',
  })
  @IsIn(['estate-masters' , 'hannex' , 'nestas' , 'dwellys', 'kasoa'])
  subsidiary: 'estate-masters' | 'hannex' | 'nestas' | 'dwellys' | 'kasoa';

  @IsOptional()
  password?: string;
}
