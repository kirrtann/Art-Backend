import { Controller, Post, Body, Req, Res, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'multer.config';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) { 
    if (!file || !(file as any).location) {
      return res.status(400).json({ message: 'File upload failed or file location missing', file });
    }

    createProductDto.img = (file as any).location; 
    createProductDto.title = req.body.title;
    createProductDto.detail = req.body.detail;
    createProductDto.price = req.body.price;

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
