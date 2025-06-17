import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service'; 
import { Product } from './product.schema'; 

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  
  @Get(':id') 
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }
  
}
