import { Controller, Post, Body, Req, Res, Patch, Delete, UseInterceptors, UploadedFile, Param, Put, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'multer.config';
import response from 'utils/constant/reponse';

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
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      createProductDto.title = req.body.title;
      createProductDto.detail = req.body.detail;
      createProductDto.price = req.body.price;
  
      // Use correct image path based on storage type
      if (file) {
        createProductDto.img = (file as any).location || file.path;
      }
  
      return this.productService.UpdateProduct(id, createProductDto, res);
    } catch (error) {
      console.error("Error updating product:", error);
      response.failureResponse({ message: "Error updating product", data: error.message }, res);
    }
  }

  @Delete('delete/:id')
  async delete(
    @Param('id') id:string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.deleteproduct(id, req, res);
  }
}
