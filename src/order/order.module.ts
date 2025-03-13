import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';

import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { PdfModule } from 'src/pdf/pdf.module';
import { OrderController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product]), PdfModule], // Import PdfModule
  controllers: [OrderController],
  providers: [OrdersService, PdfService],
})
export class OrdersModule {}
