import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../users/guards/jwt.guard';
import { VoteDto } from './dto/vote-dto';
import { Request } from 'express';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post(':recipientId')
  async vote(@Req() req, @Param('recipientId') recipientId: number) {
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
}
