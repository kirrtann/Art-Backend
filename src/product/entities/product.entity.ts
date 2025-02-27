import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' }) 
  user: User; 

  @Column()
  title: string;

  @Column()
  detail: string;

  @Column()
  img: string;

  @Column() 
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
