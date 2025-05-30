import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private repo: Repository<Vote>,
     private usersService: UsersService,
    private  logger: Logger 
  ) {
     this.logger = new Logger('' ,{
         timestamp: true
      })
  }

  async castVote(voterId: number, recipientId: number) {
    const voter = await this.usersService.findById(voterId);

    const recipient = await this.usersService.findById(recipientId);

  
    // find existing votes for new vote gender and delete
    const oldVotes = await this.repo.find({
      where: {
        recipient: {
         //  id: Equal(recipientId),
            gender: Equal(recipient.gender),
          subsidiary: Equal(recipient.subsidiary),
          },
          voter: {
            id: Equal(voterId),
         }
       },
       relations: ['recipient', 'voter'],
    });

     for (const vote of oldVotes) {
      console.error('Removing old vote: ', [vote.recipient.email, vote.recipient.gender, vote.recipient.subsidiary]);
      await this.repo.remove(vote);
    }

     const vote = this.repo.create({ voter, recipient });
     
     console.error( voter.email + ' voted for', [
       recipient.email,
       recipient.gender,
        recipient.subsidiary,
       
     ],'at', new Date().toISOString());

    return this.repo.save(vote);
  }

  findAll() {
    return this.repo.find({ relations: ['voter', 'recipient'] });
  }

  findByAny(options: FindManyOptions<Vote>) {
    return this.repo.find({
      ...options,
      relations: {
        voter: true,
        recipient: true,
      },
    });
  }

  async findOne(id: number) {
    const vote = await this.repo.findOne({
      where: { id: Equal(id) },
      relations: {
        voter: true,
        recipient: true,
      },
    });
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    return vote;
  }
   
   
 async  deleteVote(id: number) {
       const vote = await this.findOne(id);
       return this.repo.remove(vote);
    }
}
