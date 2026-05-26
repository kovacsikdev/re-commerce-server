import { Module } from '@nestjs/common';
import {
  ProductsController,
  CategoriesController,
  GearController,
  SpecialsController,
} from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [
    ProductsController,
    CategoriesController,
    GearController,
    SpecialsController,
  ],
  providers: [ProductsService],
})
export class AppModule {}