import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthController } from 'src/app.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { VotesService } from 'src/votes/votes.service';
import { VotesModule } from 'src/votes/votes.module';
import { Vote } from 'src/votes/entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Vote]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '7d' },
    }),
    
   ],

  providers: [UsersService,JwtStrategy,VotesService,Logger],
  controllers: [UsersController],
  exports: [UsersService,VotesService],
})
export class UsersModule {}
