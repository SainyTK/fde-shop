"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store";

export function ResetDemoButton() {
  const resetDemo = useShopStore((state) => state.resetDemo);
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        <RotateCcw />
        รีเซ็ตข้อมูลเดโม
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>รีเซ็ตข้อมูลเดโม?</AlertDialogTitle>
          <AlertDialogDescription>
            สินค้า คำสั่งซื้อ คูปอง และบัญชีที่สร้างใหม่ในเบราว์เซอร์นี้จะถูกล้าง
            แล้วกลับไปเป็นข้อมูลตั้งต้น
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              resetDemo();
              router.push("/");
              toast.success("รีเซ็ตข้อมูลเดโมแล้ว");
            }}
          >
            รีเซ็ต
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
