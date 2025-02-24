import { Controller, Post, Body, Req, Res, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request, Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) { 
    return this.productService.CreateProduct(createProductDto, req, res);
  }
  @Patch('update')
  async update(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.UpdateProduct(createProductDto, req, res);
  }
  
  @Delete('delete')
  async delete(
    @Body() id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.deleteproduct(id, req, res);
  }
}
