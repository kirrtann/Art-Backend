import { Controller, Post, Body, Req, Res, Patch, Delete, UseInterceptors, UploadedFile, Param, Put, Get, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'multer.config';
import response from 'utils/constant/reponse';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';


interface RequestWithUser extends Request {
  user?: User;
}

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

@Get('all')
async all(@Req() req: Request, @Res() res: Response) {
  return this.productService.all(req,res)
}

@Get('art/:user_id')
async getArtByUserId(@Param('user_id') user_id: string, @Res() res: Response) {
  try {
    const products = await this.productService.findByUserId(user_id);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
}

@Get('/search')
async search(@Query('q') query: string) {
  return this.productService.search(query)
}
@Post('create')
@UseGuards(AuthGuard('jwt')) 
@UseInterceptors(FileInterceptor('image', multerOptions)) 
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createProductDto: CreateProductDto,
  @Req() req: RequestWithUser, 
  @Res() res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }
    const user = req.user; 
    if (!file || !(file as any).location) {
      return res.status(400).json({ message: 'File upload failed', file });
    }
    createProductDto.img = (file as any).location;
    createProductDto.title = req.body.title;
    createProductDto.detail = req.body.detail;
    createProductDto.price = req.body.price;

    return this.productService.createProduct(createProductDto, user, res);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
  


@Put('update/:id')
@UseInterceptors(FileInterceptor('image', multerOptions))
async update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() createProductDto: Partial<CreateProductDto>, // Use Partial for optional updates
  @Res() res: Response,
) {
  try {
    // Assign values to DTO
    const updatedData: Partial<CreateProductDto> = {
      title: createProductDto.title,
      detail: createProductDto.detail,
      price: createProductDto.price,
    };

    // Handle image update if provided
    if (file) {
      updatedData.img = (file as any).location || file.path;
    }

    return this.productService.UpdateProduct(id, updatedData, res);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product", error: error.message });
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
