import jsQR from "jsqr";

export function decodeQr(image: ImageData): string | null {
  const result = jsQR(image.data, image.width, image.height, {
    inversionAttempts: "attemptBoth",
  });
  return result?.data ?? null;
}
