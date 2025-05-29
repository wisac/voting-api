import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteDto } from './create-vote.dto';
import { Vote } from '../entities/vote.entity';
import { UserDto } from 'src/users/dto/user-dto';

export class VoteDto extends Vote {
  constructor(vote: Vote, serverUrl: string) {
    super();
    this.id = vote.id;
    this.voter = new UserDto(vote.voter, serverUrl);
    this.recipient = new UserDto(vote.recipient, serverUrl);
    this.createdAt = vote.createdAt;
  }
}
