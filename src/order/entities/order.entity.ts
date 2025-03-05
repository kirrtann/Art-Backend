import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('orders')
export class Order {

  // @ManyToOne(() => User, (user) => user.orders, {
  //   onDelete: 'CASCADE',
  //   eager: true,
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

 
  @ManyToMany(() => Product, (product) => product)
  @JoinTable() 
  products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
