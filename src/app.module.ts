import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './token/token.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { admin } from './admin/entities/admin.entity';
import { ProductModule } from './product/product.module';

import { PdfModule } from './pdf/pdf.module';
import { OrdersModule } from './order/order.module';





@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, admin],
    synchronize: true,
    autoLoadEntities: true,
  }), UserModule, AuthModule, AdminModule, ProductModule, OrdersModule, PdfModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
