# RE Commerce — API Server

NestJS backend for the RE Commerce storefront. Serves product data from a local mock catalogue that simulates a database, themed around the Resident Evil Requiem universe.

> See [`re-commerce`](../re-commerce/README.md) for the frontend.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Runtime | Node.js / TypeScript |
| Data source | `src/assets/mock-data.json` |

---

## API Endpoints

All endpoints return JSON. Responses include `Cache-Control: public, max-age=300, stale-while-revalidate=300`.

### `POST /api/item`

Returns a single product by ID.

**Request body**
```json
{ "itemId": "SGF0Y2hldA==" }
```

**Response** — `Product` object, or `400` if `itemId` is missing, `404` if not found.

---

### `POST /api/category`

Returns all products in a given category.

**Request body**
```json
{ "category": "melee" }
```

Valid categories: `weapons` | `melee` | `medical` | `ammunition` | `parts`

**Response** — `Product[]`, or `400` if category is missing/invalid, `404` if none found.

---

### `GET /api/specials`

Returns all products that have a discount applied (`discount > 0`).

**Response** — `Product[]`, or `404` if none found.

---

## Data Model

```ts
type Product = {
  id: string;               // base64-encoded item name
  name: string;
  description: string;
  short_description: string;
  price: number;            // in-universe currency units
  discount: number;
  discount_description?: string;
  category: string;
  related_to: string[];     // IDs of related products
  img_hero_url: string;
  img_gallery_urls: string[];
  img_3d_url?: string;      // GLB model path
  parts?: ProductParts[];   // purchasable upgrade parts
};
```

---

## Getting Started

```bash
npm install
npm run dev   # http://localhost:3001
```

CORS is configured to allow requests from `http://localhost:3000` (the frontend dev server).

---

## Project Structure

```
src/
├── main.ts                  # Bootstrap; CORS config; port 3001
├── app.module.ts            # Registers controllers and service
├── products.controller.ts   # Route handlers for /api/item, /api/category, /api/specials
├── products.service.ts      # Business logic; reads mock catalogue
└── assets/
    └── mock-data.json       # Full product catalogue
```
