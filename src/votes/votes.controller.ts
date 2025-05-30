import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../users/guards/jwt.guard';
import { VoteDto } from './dto/vote-dto';
import { Request } from 'express';
import { Equal } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserDto } from 'src/users/dto/user-dto';
import { K } from 'handlebars';
import { privateDecrypt } from 'crypto';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post(':recipientId')
  async vote(@Req() req, @Param('recipientId') recipientId: number) {
    console.log('req.user.id', req.user.id);
    return new VoteDto(
      await this.votesService.castVote(req.user.id, recipientId),
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @Get('id')
  async findOne(
    @Param('id') id: number, // Corrected the parameter name to 'id' for clarity
    @Req() req: Request, // Added Request type for req parameter
  ) {
    return new VoteDto(
      await this.votesService.findOne(id),
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @Get()
  async findAll(
    @Req() req: Request, // Added Request type for req parameter
  ) {
    return (await this.votesService.findAll()).map(
      (vote) => new VoteDto(vote, `${req.protocol}://${req.get('host')}`),
    );
  }

  @Get('user/recipient/:recipientId')
  async findByRecipient(
    @Param('recipientId') recipientId: number,
    @Req() req: Request,
  ) {
    return (
      await this.votesService.findByAny({
        where: { recipient: { id: recipientId } },
      })
    ).map((vote) => new VoteDto(vote, `${req.protocol}://${req.get('host')}`));
  }

  @Get('user/voter/:voterId')
  async findByVoter(
    @Param('voterId') voterId: number,

    @Req() req: Request,
  ) {
    return (
      await this.votesService.findByAny({
        where: { voter: { id: voterId } },
      })
    ).map((vote) => {
      return new VoteDto(vote, `${req.protocol}://${req.get('host')}`);
    });
  }

  @Get('ranking/overall-best')
  async overallBestGender(@Req() req: Request) {
    const overallMale = await this.getOverallRanking(req, 'male');
    const overallFemale = await this.getOverallRanking(req, 'female');
    return {
      male: overallMale.at(-1),
      female: overallFemale.at(-1),
    };
  }

  @Get('ranking/best/:subsidiary')
  async bestBySubsidiaryAndGender(
    @Req() req: Request,
    @Param('subsidiary') subsidiary: Subsidiary,
  ) {
    if (
      !['estate-masters', 'hannex', 'nestas', 'dwellys'].includes(subsidiary)
    ) {
      throw new BadRequestException(
        `Invalid subsidiary,must be one of the following: ${['estate-masters', 'hannex', 'nestas', 'dwellys'].join(', ')}`,
      );
    }

    const male = await this.getBestSubsidiary(req, subsidiary, 'male');
    const female = await this.getBestSubsidiary(req, subsidiary, 'female');

    return {
      male,
      female,
    };
  }

  @Delete(':id')
  async deleteVote(@Param('id') id: number, @Req() req: Request) {
    return this.votesService.deleteVote(id);
  }
  private async getBestSubsidiary(
    req: Request,
    subsidiary: Subsidiary,
    gender: Gender,
  ) {
    const votes = await this.votesService.findByAny({
      where: {
        recipient: {
          subsidiary: Equal(subsidiary),
          gender: Equal(gender),
        },
      },
    });

    const users = votes.map((vote) => vote.recipient);
    const uniqueUsers = Array.from(new Set(users.map((user) => user.id))).map(
      (id) => users.find((user) => user.id === id),
    );
    const userVotes = uniqueUsers.map((user) => {
      const userVotesCount = votes.filter(
        (vote) => vote.recipient.id === user?.id,
      ).length;

      return {
        user,
        totalVotes: userVotesCount,
      };
    });
    userVotes.sort((a, b) => a.totalVotes - b.totalVotes);

    return {
      user: userVotes.at(-1)?.user
        ? new UserDto(
            userVotes.at(-1)?.user as User,
            `${req.protocol}://${req.get('host')}`,
          )
        : null,
      totalVotes: userVotes.at(-1)?.totalVotes || 0,
    };
  }

  private async getOverallRanking(req: Request, gender: Gender) {
    const votes = await this.votesService.findByAny({
      where: {
        recipient: {
          gender: Equal(gender),
        },
      },
    });

    const users = votes.map((vote) => vote.recipient);
    const uniqueUsers = Array.from(new Set(users.map((user) => user.id))).map(
      (id) => users.find((user) => user.id === id),
    );

    const userVotes = uniqueUsers.map((user) => {
      const userVotesCount = votes.filter(
        (vote) => vote.recipient.id === user?.id,
      ).length;

      return {
        user,
        totalVotes: userVotesCount,
      };
    });

    userVotes.sort((a, b) => a.totalVotes - b.totalVotes);

    return userVotes.map((uv) => {
      return {
        user: new UserDto(
          uv.user as User,
          `${req.protocol}://${req.get('host')}`,
        ),
        totalVotes: uv.totalVotes,
      };
    });
  }
}

export type Subsidiary = 'estate-masters' | 'hannex' | 'nestas' | 'dwellys';
export type Gender = 'male' | 'female';
