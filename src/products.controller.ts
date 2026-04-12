import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Product, ProductsService, Category } from './products.service';

type FindItemPayload = {
  itemId?: string;
};

type FindCategoriesPayload = {
  category?: Category
}

const VALID_CATEGORIES: Category[] = ['weapons', 'melee', 'medical', 'ammunition', 'parts'];

@Controller('api/item')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=300')
  findById(@Body() payload: FindItemPayload): Product {
    if (!payload?.itemId || typeof payload.itemId !== 'string') {
      throw new HttpException('itemId is required', HttpStatus.BAD_REQUEST);
    }

    const item = this.productsService.findById(payload.itemId);
    if (!item) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    return item;
  }
}

@Controller('api/category')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=300')
  findByCategory(@Body() payload: FindCategoriesPayload): Product[] {
    if (
      !payload?.category ||
      typeof payload.category !== 'string' ||
      !VALID_CATEGORIES.includes(payload.category as Category)
    ) {
      throw new HttpException('category is required', HttpStatus.BAD_REQUEST);
    }

    const items = this.productsService.findByCategory(payload.category as Category);
    if (!items) {
      throw new HttpException('Items not found', HttpStatus.NOT_FOUND);
    }

    return items;
  }
}

@Controller('api/specials')
export class SpecialsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=300')
  getSpecialsQuery(): Product[] {

    const items = this.productsService.getSpecials();
    if (!items) {
      throw new HttpException('Specials not found', HttpStatus.NOT_FOUND);
    }

    return items;
  }
}