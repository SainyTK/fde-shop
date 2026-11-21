"use client";

import { useEffect, useState } from "react";
import { qrToDataUrl } from "@/lib";

export function useQrImage(text: string, size: number): string | null {
  const [image, setImage] = useState<{ text: string; url: string } | null>(
    null,
  );
  useEffect(() => {
    let active = true;
    qrToDataUrl(text, size).then((url) => {
      if (active) {
        setImage({ text, url });
      }
    });
    return () => {
      active = false;
    };
  }, [text, size]);
  return image?.text === text ? image.url : null;
}
