import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ nullable: true })
  img: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'date', nullable: true })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;
}
