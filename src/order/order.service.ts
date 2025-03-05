import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(Order)
      private readonly orderRepository: Repository<Order>,
      
    ) {}
  create(createOrderDto: CreateOrderDto) {
    return 
  }

  

 


}
