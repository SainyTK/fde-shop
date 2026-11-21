export type Review = {
  rating: number;
  comment: string;
  reviewerName: string;
};

export type Product = {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  sold: number;
  rating: number;
  reviews: Review[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  lowStockThreshold: number;
  active: boolean;
};

export type CatalogEntry = {
  slug: string;
  name: string;
  description: string;
  category: string;
  brand: string | null;
  priceUsd: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  images: string[];
  reviews: Review[];
};
