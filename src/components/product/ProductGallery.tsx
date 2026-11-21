"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-white ring-1 ring-black/5">
        <Image
          src={current}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 450px, 100vw"
          className="object-contain"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`รูปที่ ${index + 1}`}
              onMouseEnter={() => setActive(index)}
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm bg-white ring-2 transition",
                index === active
                  ? "ring-primary"
                  : "ring-transparent hover:ring-primary/40",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="90px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
