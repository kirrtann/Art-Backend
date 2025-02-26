import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string; 
  
  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  detail: string;

  @Column()
  @IsUrl()
  img: string;

  @Column() 
   @IsNotEmpty()
  @IsNumber()
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

}
