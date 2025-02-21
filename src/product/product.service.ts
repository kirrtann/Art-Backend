import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import response from 'utils/constant/reponse';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async CreateProduct(createProductDto: CreateProductDto, req: Request, res: Response) {
    try {
      const product = this.productRepository.create({
        title: createProductDto.title,
        detail: createProductDto.detail,
        img: createProductDto.img,
        price: createProductDto.price,
      });

      const savedProduct = await this.productRepository.save(product);

      response.successCreate(savedProduct, res);
    } catch (error) {
      console.error('Error in CreateProduct:', error)
      response.failureResponse({ message: 'Error creating product', data: error.message }, res);
    }
  }
}
