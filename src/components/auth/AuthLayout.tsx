import { ShieldCheck, TicketPercent, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/common";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

const POINTS = [
  { icon: TicketPercent, label: "โค้ดส่วนลดจากร้านค้า" },
  { icon: ShieldCheck, label: "ตรวจสลิปโอนเงินอัตโนมัติ" },
  { icon: Truck, label: "ติดตามพัสดุได้ทุกขั้นตอน" },
];

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-white shadow-xs">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:h-20">
          <Logo href="/" tone="brand" suffix={title} />
        </div>
      </header>
      <main className="flex flex-1 bg-primary">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-8 md:grid-cols-[1fr_25rem] md:py-14">
          <div className="hidden flex-col gap-6 text-white md:flex">
            <p className="font-semibold text-4xl leading-tight">
              ช้อปง่าย ขายคล่อง
              <br />
              บน FDE Shop
            </p>
            <ul className="flex flex-col gap-3">
              {POINTS.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-3 text-lg"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                    <point.icon className="size-5" />
                  </span>
                  {point.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md bg-white p-6 shadow-xl sm:p-7">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
