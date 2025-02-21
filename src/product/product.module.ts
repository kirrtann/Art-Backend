import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { VerifyTokenMiddleware } from 'src/middleware/VerifyToken';

import { AuthModule } from 'src/token/token.module'; 
import { Token } from 'src/token/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Token]),
    AuthModule, 
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(ProductController);
  }
}
