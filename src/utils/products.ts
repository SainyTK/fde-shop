import type { Product, ProductInput, Result, ShopData } from "@/types";
import { newId } from "./id";
import { applyStockChange } from "./stock";

export type ProductSort =
  | "relevance"
  | "latest"
  | "best-selling"
  | "price-asc"
  | "price-desc";

export type ProductQuery = {
  text: string;
  category: string | null;
  sort: ProductSort;
  sellerId: string | null;
};

export function searchProducts(
  products: Product[],
  query: ProductQuery,
): Product[] {
  const words = query.text.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = products.filter((product) => {
    if (!product.active) {
      return false;
    }
    if (query.category && product.category !== query.category) {
      return false;
    }
    if (query.sellerId && product.sellerId !== query.sellerId) {
      return false;
    }
    const haystack =
      `${product.name} ${product.brand ?? ""} ${product.description}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
  return sortProducts(matches, query.sort);
}

export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  const sorted = [...products];
  if (sort === "latest") {
    return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (sort === "best-selling") {
    return sorted.sort((a, b) => b.sold - a.sold);
  }
  if (sort === "price-asc") {
    return sorted.sort((a, b) => a.price - b.price);
  }
  if (sort === "price-desc") {
    return sorted.sort((a, b) => b.price - a.price);
  }
  return sorted.sort(
    (a, b) => b.rating * Math.log(b.sold + 2) - a.rating * Math.log(a.sold + 2),
  );
}

export function validateProductInput(input: ProductInput): string | null {
  if (input.name.trim().length < 3) {
    return "ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร";
  }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    return "ราคาต้องมากกว่า 0";
  }
  if (input.originalPrice !== null && input.originalPrice <= input.price) {
    return "ราคาก่อนลดต้องมากกว่าราคาขาย";
  }
  if (input.images.length === 0) {
    return "กรุณาเพิ่มรูปสินค้าอย่างน้อย 1 รูป";
  }
  if (
    !Number.isInteger(input.lowStockThreshold) ||
    input.lowStockThreshold < 0
  ) {
    return "จุดแจ้งเตือนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0";
  }
  return null;
}

export function createProduct(
  data: ShopData,
  sellerId: string,
  input: ProductInput,
  initialStock: number,
  now: string,
): Result<{ data: ShopData; productId: string }> {
  const problem = validateProductInput(input);
  if (problem) {
    return { ok: false, error: problem };
  }
  if (!Number.isInteger(initialStock) || initialStock < 0) {
    return { ok: false, error: "จำนวนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0" };
  }
  const product: Product = {
    ...input,
    name: input.name.trim(),
    description: input.description.trim(),
    id: newId(),
    sellerId,
    stock: 0,
    sold: 0,
    rating: 0,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  };
  const withProduct = { ...data, products: [product, ...data.products] };
  return {
    ok: true,
    value: {
      productId: product.id,
      data: applyStockChange(withProduct, {
        productId: product.id,
        quantity: initialStock,
        reason: "initial",
        note: "สร้างสินค้าใหม่",
        orderId: null,
        at: now,
      }),
    },
  };
}

export function updateProduct(
  data: ShopData,
  productId: string,
  input: ProductInput,
  now: string,
): Result<ShopData> {
  const problem = validateProductInput(input);
  if (problem) {
    return { ok: false, error: problem };
  }
  return {
    ok: true,
    value: {
      ...data,
      products: data.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...input,
              name: input.name.trim(),
              description: input.description.trim(),
              updatedAt: now,
            }
          : product,
      ),
    },
  };
}

export type StockAdjustment = {
  productId: string;
  mode: "restock" | "set";
  quantity: number;
  note: string;
  now: string;
};

export function adjustStock(
  data: ShopData,
  adjustment: StockAdjustment,
): Result<ShopData> {
  const product = data.products.find(
    (item) => item.id === adjustment.productId,
  );
  if (!product) {
    return { ok: false, error: "ไม่พบสินค้า" };
  }
  if (!Number.isInteger(adjustment.quantity) || adjustment.quantity < 0) {
    return { ok: false, error: "จำนวนต้องเป็นจำนวนเต็มตั้งแต่ 0" };
  }
  if (adjustment.mode === "restock" && adjustment.quantity === 0) {
    return { ok: false, error: "จำนวนรับเข้าต้องมากกว่า 0" };
  }
  const delta =
    adjustment.mode === "restock"
      ? adjustment.quantity
      : adjustment.quantity - product.stock;
  if (delta === 0) {
    return { ok: false, error: "ยอดสต็อกเท่าเดิม ไม่มีการเปลี่ยนแปลง" };
  }
  return {
    ok: true,
    value: applyStockChange(data, {
      productId: product.id,
      quantity: delta,
      reason: adjustment.mode === "restock" ? "restock" : "adjustment",
      note: adjustment.note.trim(),
      orderId: null,
      at: adjustment.now,
    }),
  };
}

export function deleteProduct(
  data: ShopData,
  productId: string,
): Result<ShopData> {
  const hasOrders = data.orders.some((order) =>
    order.items.some((item) => item.productId === productId),
  );
  if (hasOrders) {
    return {
      ok: true,
      value: {
        ...data,
        products: data.products.map((product) =>
          product.id === productId ? { ...product, active: false } : product,
        ),
      },
    };
  }
  return {
    ok: true,
    value: {
      ...data,
      products: data.products.filter((product) => product.id !== productId),
      stockMovements: data.stockMovements.filter(
        (movement) => movement.productId !== productId,
      ),
      carts: Object.fromEntries(
        Object.entries(data.carts).map(([userId, lines]) => [
          userId,
          lines.filter((line) => line.productId !== productId),
        ]),
      ),
    },
  };
}
