import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/votes.module';
import { User } from './users/entities/user.entity';
import { Vote } from './votes/entities/vote.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
      ServeStaticModule.forRoot({
         rootPath: join(__dirname, '..', 'uploads'),
       }),
     ],
  
})
export class AppModule {}
