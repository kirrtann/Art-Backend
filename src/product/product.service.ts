import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
  //creact the product
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
  //update the product
  async UpdateProduct(id: number, createProductDto: CreateProductDto, req: Request, res: Response) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        return response.recordNotFound({ message: 'Product not found', data: null }, res);
      }
      product.title = createProductDto.title;
      product.detail = createProductDto.detail;
      product.price = createProductDto.price;
      if (createProductDto.img) {
        [
          product.img = createProductDto.img
        ]
      }
      product.updated_at = new Date();
      const updatedProduct = await this.productRepository.save(product);

      response.successResponse({ message: 'Product updated successfully', data: updatedProduct }, res);
    } catch (error) {
      console.error('Error in UpdateProduct:', error);
      response.failureResponse({ message: 'Error updating product', data: error.message }, res);
    }
  }

  //delete the product
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
      response.failureResponse({ message: 'Error delete product', data: error.message }, res);
    }

  }

  //find the all Product
  async all(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find({
        where: { deleted_at: IsNull() }
      });

      console.log('Active Products:', products);
      res.status(200).json({ status: 1, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ status: 0, message: 'Error fetching products' });
    }
  }
}