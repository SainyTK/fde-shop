"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field, OptionSelect, Panel } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DEFAULT_LOW_STOCK_THRESHOLD } from "@/constants";
import { compressImage } from "@/services";
import type { Product, ProductInput } from "@/types";

const MAX_IMAGES = 5;

type ProductFormProps = {
  product: Product | null;
  onSubmit: (input: ProductInput, initialStock: number) => boolean;
};

function toNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(
    product?.category ?? CATEGORIES[0].id,
  );
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : "",
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [threshold, setThreshold] = useState(
    String(product?.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD),
  );
  const [initialStock, setInitialStock] = useState("10");
  const [active, setActive] = useState(product?.active ?? true);

  const addImages = async (files: FileList | null) => {
    if (!files) {
      return;
    }
    const room = MAX_IMAGES - images.length;
    try {
      const added = await Promise.all(
        [...files].slice(0, room).map((file) => compressImage(file, 800)),
      );
      setImages((current) => [...current, ...added]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ");
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(
      {
        name,
        description,
        category,
        brand: brand.trim() || null,
        price: toNumber(price),
        originalPrice: originalPrice.trim() ? toNumber(originalPrice) : null,
        images,
        lowStockThreshold: toNumber(threshold),
        active,
      },
      toNumber(initialStock),
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Panel title="ข้อมูลทั่วไป">
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-sm">
              รูปสินค้า ({images.length}/{MAX_IMAGES})
            </span>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div
                  key={image.slice(-40)}
                  className="group relative size-24 overflow-hidden rounded-md border bg-white"
                >
                  <Image
                    src={image}
                    alt={`รูปที่ ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                  {index === 0 ? (
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[10px] text-white">
                      รูปหลัก
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`ลบรูปที่ ${index + 1}`}
                    onClick={() =>
                      setImages((current) =>
                        current.filter((_, position) => position !== index),
                      )
                    }
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES ? (
                <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-primary/40 border-dashed text-primary text-xs hover:bg-secondary">
                  <ImagePlus className="size-6" />
                  เพิ่มรูป
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      addImages(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>
              ) : null}
            </div>
          </div>
          <Field id="product-name" label="ชื่อสินค้า">
            <Input
              id="product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="product-category" label="หมวดหมู่">
              <OptionSelect
                id="product-category"
                value={category}
                options={CATEGORIES.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))}
                onChange={setCategory}
              />
            </Field>
            <Field id="product-brand" label="แบรนด์">
              <Input
                id="product-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="(ไม่บังคับ)"
              />
            </Field>
          </div>
          <Field id="product-description" label="รายละเอียดสินค้า">
            <Textarea
              id="product-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </div>
      </Panel>
      <Panel title="ราคาและสต็อก">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="product-price" label="ราคาขาย (บาท)">
            <Input
              id="product-price"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </Field>
          <Field
            id="product-original"
            label="ราคาก่อนลด (บาท)"
            hint="ไม่บังคับ แสดงเป็นส่วนลด"
          >
            <Input
              id="product-original"
              inputMode="decimal"
              value={originalPrice}
              onChange={(event) => setOriginalPrice(event.target.value)}
            />
          </Field>
          {product ? null : (
            <Field id="product-stock" label="สต็อกเริ่มต้น (ชิ้น)">
              <Input
                id="product-stock"
                inputMode="numeric"
                value={initialStock}
                onChange={(event) => setInitialStock(event.target.value)}
              />
            </Field>
          )}
          <Field id="product-threshold" label="แจ้งเตือนเมื่อเหลือไม่เกิน (ชิ้น)">
            <Input
              id="product-threshold"
              inputMode="numeric"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
            />
          </Field>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <Switch checked={active} onCheckedChange={setActive} />
          เปิดขายสินค้านี้
        </label>
      </Panel>
      <div className="flex justify-end gap-2">
        <Button type="submit" size="lg" className="h-10 px-8">
          {product ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </Button>
      </div>
    </form>
  );
}
