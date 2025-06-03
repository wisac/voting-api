import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';

export class UserDto extends User {
   totalVotes?: number
  constructor(user: User, serverUrl: string,totalVotes?: number) {
     super();
     this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.gender = user.gender;
    this.subsidiary = user.subsidiary;
    this.pictures = user.pictures.map((pic) => {
      return `${serverUrl}/${pic}`;
    });
     this.plainPassword = user.plainPassword;
     this.description = user.description
     this.totalVotes = totalVotes
     
  }
   
}
