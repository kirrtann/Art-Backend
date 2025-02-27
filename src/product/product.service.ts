import { Injectable, NotFoundException, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import response from 'utils/constant/reponse';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  //creact the product

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
    res: Response,
  ) {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        user,
      });
      const savedProduct = await this.productRepository.save(product);
      return res.status(201).json({ success: true, data: savedProduct });
    } catch (error) {
      console.error('Error in createProduct:', error);
      return res
        .status(500)
        .json({ message: 'Error creating product', error: error.message });
    }
  }
  //update the product
  async UpdateProduct(
    id: string,
    createProductDto: CreateProductDto,
    res: Response,
  ) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        return response.recordNotFound(
          { message: 'Product not found', data: null },
          res,
        );
      }

      // Update product details
      product.title = createProductDto.title;
      product.detail = createProductDto.detail;
      product.price = createProductDto.price;

      // Update image only if a new one is provided
      if (createProductDto.img) {
        product.img = createProductDto.img;
      }

      product.updated_at = new Date();
      const updatedProduct = await this.productRepository.save(product);

      response.successResponse(
        { message: 'Product updated successfully', data: updatedProduct },
        res,
      );
    } catch (error) {
      console.error('Error in UpdateProduct:', error);
      response.failureResponse(
        { message: 'Error updating product', data: error.message },
        res,
      );
    }
  }

  //delete the product
  async deleteproduct(id: string, req: Request, res: Response) {
    try {
      const product = await this.productRepository.findOneBy({
        id,
      });
      if (!product) {
        return response.recordNotFound(
          { message: 'Product not found', data: null },
          res,
        );
      }
      product.deleted_at = new Date();
      const updatedProduct = await this.productRepository.save(product);
      response.successResponse(
        { message: 'Product deleted successfully', data: updatedProduct },
        res,
      );
    } catch (error) {
      console.error('Error in UpdateProduct:', error);
      response.failureResponse(
        { message: 'Error delete product', data: error.message },
        res,
      );
    }
  }

  //find the all Product
  async all(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find({
        where: { deleted_at: IsNull() },
      });

      res.status(200).json({ status: 1, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ status: 0, message: 'Error fetching products' });
    }
  }

  async findByUserId(user_id: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { user: { id: user_id } },
      relations: ['user'],
    });
  
    if (!products.length) {
      throw new NotFoundException(`No products found for User ID: ${user_id}`);
    }
  
    return products;
  }
}
