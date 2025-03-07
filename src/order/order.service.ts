import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';



@Injectable()

export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async getUserOrders(userId: string) {
    return await this.orderRepository.find({
      where: { user: { id: userId }  },  
      relations: ['product','user'], 
     
    });
  }
  
  async createOrder(user_id: string, product_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) throw new Error('User not found');

    const product = await this.productRepository.findOne({ where: { id: product_id } });
    if (!product) throw new Error('Product not found');

    const newOrder = this.orderRepository.create({ user, product });
    await this.orderRepository.save(newOrder);

    return { message: 'Order created successfully', order: newOrder };
  }
}



