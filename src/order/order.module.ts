import { Module } from '@nestjs/common';
import {  OrdersService } from './order.service';
import { OrderController } from './order.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
 imports: [
  
    TypeOrmModule.forFeature([Order, User, Product]),
    UserModule, 
    ProductModule 
  ]
  ,
  controllers: [OrderController],
  providers: [OrdersService],

})
export class OrderModule {}
