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

type FindGearPayload = {
  category?: Category | Category[];
  price?: {
    min?: number;
    max?: number;
  };
  sort?: 'asc' | 'desc';
};

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

@Controller('api/gear')
export class GearController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=60')
  findByGear(@Body() payload: FindGearPayload): Product[] {
    const categoryValues = Array.isArray(payload?.category)
      ? payload.category
      : payload?.category
        ? [payload.category]
        : [];

    const hasInvalidCategory = categoryValues.some(
      (category) =>
        typeof category !== 'string' ||
        !VALID_CATEGORIES.includes(category as Category),
    );
    if (hasInvalidCategory) {
      throw new HttpException('category must be valid', HttpStatus.BAD_REQUEST);
    }

    const min = payload?.price?.min;
    const max = payload?.price?.max;
    const hasInvalidMin = min !== undefined && (typeof min !== 'number' || Number.isNaN(min));
    const hasInvalidMax = max !== undefined && (typeof max !== 'number' || Number.isNaN(max));
    if (hasInvalidMin || hasInvalidMax) {
      throw new HttpException('price must be numeric', HttpStatus.BAD_REQUEST);
    }

    if (min !== undefined && max !== undefined && min > max) {
      throw new HttpException('price min cannot exceed max', HttpStatus.BAD_REQUEST);
    }

    const sort = payload?.sort;
    if (sort !== undefined && sort !== 'asc' && sort !== 'desc') {
      throw new HttpException('sort must be asc or desc', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.findByGear({
      category: categoryValues,
      price: payload?.price,
      sort,
    });
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