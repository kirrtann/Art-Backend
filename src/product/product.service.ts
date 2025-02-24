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

  async UpdateProduct(createProductDto: CreateProductDto, req: Request, res: Response) {
    try {
      const product = await this.productRepository.findOneBy({ id: req.body.id });

      if (!product) {
        return response.recordNotFound({ message: 'Product not found', data: null }, res);
      }
      product.title = createProductDto.title;
      product.detail = createProductDto.detail;
      product.img = createProductDto.img;
      product.price = createProductDto.price;

      const updatedProduct = await this.productRepository.save(product);

      response.successResponse({ message: 'Product updated successfully', data: updatedProduct }, res);
    } catch (error) {
      console.error('Error in UpdateProduct:', error);
      response.failureResponse({ message: 'Error updating product', data: error.message }, res);
    }
  }
  async deleteproduct(id: number, req: Request, res: Response) {
    try {
      const product = await this.productRepository.findOneBy({
        id: req
          .body.id
      });
      if (!product) {
        return response.recordNotFound({ message: 'Product not found', data: null }, res);
      }
      product.deleted_at = new Date();
      const updatedProduct = await this.productRepository.save(product);
      response.successResponse({ message: 'Product deleted successfully', data: updatedProduct }, res);
    } catch (error) {
      console.error('Error in UpdateProduct:', error);
      response.failureResponse({ message: 'Error updating product', data: error.message }, res);
    }

  }

}