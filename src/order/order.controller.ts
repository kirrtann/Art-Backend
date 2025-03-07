import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { OrdersService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('history/:user_id')
  async getUserOrders(@Param('user_id') user_id: string) {
    return this.ordersService.getUserOrders(user_id);
  }
  @Post('Postorder')
  async orderDetail(
    @Body() orderData: { user_id: string; product_id: string },
  ) {
    return this.ordersService.createOrder(
      orderData.user_id,
      orderData.product_id,
    );
  }
}
