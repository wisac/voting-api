import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';


@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  voter: User;

  @ManyToOne(() => User)
  recipient: User;

  @CreateDateColumn()
  createdAt: Date;
}
