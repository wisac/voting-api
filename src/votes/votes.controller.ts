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

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post(':recipientId')
  async vote(@Req() req, @Param() recipientId: number) {
    return this.votesService.castVote(req.user.userId, recipientId);
  }

  @Get('id')
  findOne(
    @Param('id') id: number, // Corrected the parameter name to 'id' for clarity
  ) {
    return this.votesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Get('user/recipient/:recipientId')
  findByRecipient(@Param('recipientId') recipientId: number) {
    return this.votesService.findByAny({
      where: { recipient: { id: recipientId } },
    });
  }

  @Get('user/voter/:voterId')
  findByVoter(@Param('voterId') voterId: number) {
    return this.votesService.findByAny({
      where: { voter: { id: voterId } },
    });
  }
}
