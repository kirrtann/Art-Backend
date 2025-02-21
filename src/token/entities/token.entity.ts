import { User } from './../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class  Token {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'fk_user' }) 
  user: User;

  @Column({ unique: true }) 
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
