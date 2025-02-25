import { Controller, Post, Body, Req, Res, Patch, Delete, UseInterceptors, UploadedFile, Param, Put, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'multer.config';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

@Get('all')
async all(@Req() req: Request, @Res() res: Response) {
  return this.productService.all(req,res)
}

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

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('Updated File:', file);
    console.log('Request Body:', req.body);

    if (file) {
      createProductDto.img = (file as any).locations
      createProductDto.title = req.body.title;
      createProductDto.detail = req.body.detail;
      createProductDto.price = req.body.price;
    }
    return this.productService.UpdateProduct(id, createProductDto, req, res);
  }

  @Delete('delete/:id')
  async delete(
    @Body() id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.deleteproduct(id, req, res);
  }
}
