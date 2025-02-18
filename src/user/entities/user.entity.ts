import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  mobile_number: string;

  @Column({ type: 'date', nullable: true })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;
}
