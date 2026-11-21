import { CATEGORIES } from "@/constants";

export function categoryFromSource(source: string): string {
  const match = CATEGORIES.find((category) =>
    category.sources.includes(source),
  );
  return match?.id ?? "other";
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? "อื่น ๆ";
}
