import { User } from './../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  jwt: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ type: 'date', nullable: true })
  created_at: Date;
}
