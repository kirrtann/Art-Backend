import { Product } from './../../provider/entities/provider.entity';
import { User } from './../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'date', nullable: true })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;
}
