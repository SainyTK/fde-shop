import type { CartLine, Product, User } from "@/types";

export type CartItem = {
  line: CartLine;
  product: Product;
};

export type CartGroup = {
  seller: User;
  items: CartItem[];
};

export function groupCart(
  lines: CartLine[],
  products: Product[],
  users: User[],
): CartGroup[] {
  const groups = new Map<string, CartGroup>();
  for (const line of lines) {
    const product = products.find((item) => item.id === line.productId);
    const seller = users.find((user) => user.id === product?.sellerId);
    if (!product || !seller) {
      continue;
    }
    const group = groups.get(seller.id) ?? { seller, items: [] };
    group.items.push({ line, product });
    groups.set(seller.id, group);
  }
  return [...groups.values()];
}

export function selectedItems(group: CartGroup): CartItem[] {
  return group.items.filter((item) => item.line.selected);
}

export function itemsSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.line.quantity,
    0,
  );
}

export function cartQuantity(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartLineProblem(item: CartItem): string | null {
  if (!item.product.active) {
    return "สินค้านี้ปิดการขายแล้ว";
  }
  if (item.product.stock <= 0) {
    return "สินค้าหมด";
  }
  if (item.line.quantity > item.product.stock) {
    return `เหลือเพียง ${item.product.stock} ชิ้น`;
  }
  return null;
}
