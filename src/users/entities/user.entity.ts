import { Subsidiary } from 'src/votes/votes.controller';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
 
   

   @Column({ nullable: true })
   name: string;

  @Column()
  passwordHash: string;

  @Column()
  plainPassword: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({
    default: 'male',
  })
  gender: 'male' | 'female';

  @Column({
     type: 'json',
      nullable: true,
    default: () => "'[]'", // Default to an empty array
  })
  pictures: string[] = [];

  @Column({
    nullable: true,
  })
  subsidiary: Subsidiary


  @Column({
   nullable: true,
   type: 'text'
  })
  description: string
}
