import { decodeQr, recognizeText } from "@/lib";
import type { SlipScan } from "@/types";
import { drawToCanvas, loadImage } from "./image";

export type ScanStep = "qr" | "ocr";

function readQr(canvas: HTMLCanvasElement): string | null {
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  return decodeQr(context.getImageData(0, 0, canvas.width, canvas.height));
}

export async function scanSlip(
  dataUrl: string,
  onStep: (step: ScanStep) => void,
): Promise<SlipScan> {
  onStep("qr");
  const image = await loadImage(dataUrl);
  const qrText =
    readQr(drawToCanvas(image, 1200)) ?? readQr(drawToCanvas(image, 600));
  onStep("ocr");
  const ocrText = await recognizeText(dataUrl).catch(() => "");
  return { qrText, ocrText };
}
