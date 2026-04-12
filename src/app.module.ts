import { Module } from '@nestjs/common';
import { ProductsController, CategoriesController, SpecialsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController, CategoriesController, SpecialsController],
  providers: [ProductsService],
})
export class AppModule {}