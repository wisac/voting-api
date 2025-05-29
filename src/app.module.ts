import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/votes.module';
import { User } from './users/entities/user.entity';
import { Vote } from './votes/entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'voting.db',
      synchronize: true,
      entities: [User, Vote],
    }),
    UsersModule,
    VotesModule,
  ],
})
export class AppModule {}
