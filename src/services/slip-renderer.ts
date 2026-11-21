import { qrToDataUrl } from "@/lib";
import { loadImage } from "./image";

export type DemoSlip = {
  bankName: string;
  bankColor: string;
  senderName: string;
  receiverName: string;
  receiverAccount: string;
  amount: string;
  fee: string;
  dateTime: string;
  transRef: string;
  qrPayload: string;
  disclaimer: string;
};

const WIDTH = 720;
const HEIGHT = 1180;

export async function renderDemoSlip(slip: DemoSlip): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("สร้างสลิปไม่ได้");
  }
  const font = getComputedStyle(document.body).fontFamily;
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight = 400,
    align: CanvasTextAlign = "left",
  ) => {
    context.font = `${weight} ${size}px ${font}`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(value, x, y);
  };
  context.fillStyle = "#f4f6f5";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = slip.bankColor;
  context.fillRect(0, 0, WIDTH, 180);
  text(slip.bankName, 48, 78, 34, "#ffffff", 700);
  text("โอนเงินสำเร็จ", 48, 128, 28, "#ffffff", 500);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.roundRect(32, 150, WIDTH - 64, HEIGHT - 190, 24);
  context.fill();
  context.fillStyle = "#16a34a";
  context.beginPath();
  context.arc(WIDTH / 2, 238, 40, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#ffffff";
  context.lineWidth = 8;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(WIDTH / 2 - 18, 238);
  context.lineTo(WIDTH / 2 - 4, 254);
  context.lineTo(WIDTH / 2 + 20, 224);
  context.stroke();
  text(slip.dateTime, WIDTH / 2, 316, 24, "#4b5563", 400, "center");
  const rows: [string, string, string][] = [
    ["จาก", slip.senderName, slip.bankName],
    ["ไปยัง", slip.receiverName, slip.receiverAccount],
  ];
  rows.forEach(([label, name, detail], index) => {
    const y = 390 + index * 120;
    text(label, 72, y, 22, "#6b7280");
    text(name, 72, y + 38, 28, "#111827", 600);
    text(detail, 72, y + 72, 22, "#6b7280");
  });
  context.fillStyle = "#e5e7eb";
  context.fillRect(72, 618, WIDTH - 144, 2);
  text("จำนวนเงิน (บาท)", 72, 672, 24, "#6b7280");
  text(slip.amount, 72, 744, 64, "#111827", 700);
  text(`ค่าธรรมเนียม ${slip.fee} บาท`, 72, 796, 22, "#6b7280");
  text("เลขที่รายการ", 72, 868, 22, "#6b7280");
  text(slip.transRef, 72, 904, 24, "#111827", 600);
  const qr = await loadImage(await qrToDataUrl(slip.qrPayload, 220));
  context.drawImage(qr, WIDTH - 72 - 200, 830, 200, 200);
  text("สแกนตรวจสอบสลิป", WIDTH - 72 - 100, 1056, 20, "#6b7280", 400, "center");
  text(slip.disclaimer, WIDTH / 2, HEIGHT - 60, 20, "#9ca3af", 400, "center");
  return canvas.toDataURL("image/png");
}
