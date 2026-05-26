import { Injectable } from "@nestjs/common";
import mockData from "./assets/mock-data.json";

export type Category = 'weapons' | 'melee' | 'medical' | 'ammunition' | 'parts'

type PriceFilter = {
  min?: number;
  max?: number;
};

type GearFilter = {
  category?: Category | Category[];
  price?: PriceFilter;
  sort?: 'asc' | 'desc';
};

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

  findByGear(filters: GearFilter): Product[] {
    const categoryFilters = Array.isArray(filters.category)
      ? filters.category
      : filters.category
        ? [filters.category]
        : [];
    const minPrice = filters.price?.min;
    const maxPrice = filters.price?.max;
    const sort = filters.sort ?? 'desc';

    const filteredItems = this.catalog.items.filter((item) => {
      const matchesCategory =
        categoryFilters.length === 0 ||
        categoryFilters.includes(item.category as Category);
      const matchesMinPrice =
        typeof minPrice !== 'number' || Number.isNaN(minPrice)
          ? true
          : item.price >= minPrice;
      const matchesMaxPrice =
        typeof maxPrice !== 'number' || Number.isNaN(maxPrice)
          ? true
          : item.price <= maxPrice;

      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    return filteredItems.sort((a, b) =>
      sort === 'asc' ? a.price - b.price : b.price - a.price,
    );
  }

  getSpecials(): Product[] | undefined {
    return this.catalog.items.filter((item) => item.discount > 0)
  }
}
