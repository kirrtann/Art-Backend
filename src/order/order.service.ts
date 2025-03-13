import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { PdfService } from 'src/pdf/pdf.service';



@Injectable()

export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly pdfService: PdfService, // Inject PdfService
  ) {}
  async getUserOrders(userId: string) {
    return await this.orderRepository.find({
      where: { user: { id: userId }  },  
      relations: ['product','user'], 
     
    });
  }
  
  async createOrder(user_id: string, product_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) throw new Error('User not found');
  
    const product = await this.productRepository.findOne({ where: { id: product_id } });
    if (!product) throw new Error('Product not found');
  
    // Check if product is already sold
    if (product.status === 'sold') {
      throw new Error('Product is already sold');
    }
  
    // Create Order
    const newOrder = this.orderRepository.create({ user, product });
    await this.orderRepository.save(newOrder);
  
    // Update Product Status to "sold"
    product.status = 'sold';
    await this.productRepository.save(product);
  
    // Generate Invoice PDF
    const invoiceData = {
      invoiceNumber: newOrder.id,
      date: new Date().toISOString().split('T')[0],
      customer: {
        name: user.name,
        email: user.email,
      },
      items: [
        {
          name: product.title,
          quantity: 1,
          price: product.price,
        },
      ],
    };
  
    const pdfUrl = await this.pdfService.generateInvoicePdf(invoiceData);
    newOrder.invoice_url = pdfUrl;
    await this.orderRepository.save(newOrder);
  
    return { message: 'Order created successfully', order: newOrder };
  }
  
}



