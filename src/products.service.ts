import { Injectable } from "@nestjs/common";
import mockData from "./assets/mock-data.json";

export type Category = 'weapons' | 'melee' | 'medical' | 'ammunition' | 'parts'

export type Product = {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  discount: number;
  discount_description?: string;
  category: string;
  related_to: string[];
  img_hero_url: string;
  img_gallery_urls: string[];
  img_3d_url?: string;
  parts?: ProductParts[]
};

type ProductParts ={
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  discount_description?: string;
}

type Catalog = {
  id: string;
  name: string;
  items: Product[];
};


@Injectable()
export class ProductsService {
  private readonly catalog = mockData as Catalog;

  findById(itemId: string): Product | undefined {
    return this.catalog.items.find((item) => item.id === itemId);
  }

  findByCategory(category: Category): Product[] | undefined {
    return this.catalog.items.filter((item) => item.category === category)
  }

  getSpecials(): Product[] | undefined {
    return this.catalog.items.filter((item) => item.discount > 0)
  }
}
