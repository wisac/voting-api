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

   @ManyToOne(() => User, {
      onDelete: 'CASCADE',
      eager: true,
  })
  voter: User;

   @ManyToOne(() => User, {
      onDelete: 'CASCADE',
      eager: true,
  })
  recipient: User;

  @CreateDateColumn()
  createdAt: Date;
}
