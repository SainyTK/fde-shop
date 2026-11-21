"use client";

import { RefreshCw, Truck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field, OptionSelect } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CARRIERS } from "@/constants";
import { useShopStore } from "@/store";
import type { Order, Shop } from "@/types";
import { createRandom, generateTrackingNumber } from "@/utils";

export function ShipDialog({ order, shop }: { order: Order; shop: Shop }) {
  const shipOrder = useShopStore((state) => state.shipOrder);
  const [open, setOpen] = useState(false);
  const [carrierId, setCarrierId] = useState(CARRIERS[0].id);
  const [trackingNumber, setTrackingNumber] = useState("");

  const generate = () => {
    const carrier =
      CARRIERS.find((item) => item.id === carrierId) ?? CARRIERS[0];
    setTrackingNumber(
      generateTrackingNumber(carrier, createRandom(Date.now())),
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = shipOrder(order.id, {
      carrierId,
      trackingNumber,
      origin: shop.location,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("บันทึกการจัดส่งแล้ว ผู้ซื้อติดตามพัสดุได้ทันที");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Truck />
        ส่งพัสดุ
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ส่งพัสดุ</DialogTitle>
          <DialogDescription>คำสั่งซื้อ #{order.number}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field id="ship-carrier" label="บริษัทขนส่ง">
            <OptionSelect
              id="ship-carrier"
              value={carrierId}
              options={CARRIERS.map((carrier) => ({
                value: carrier.id,
                label: carrier.name,
              }))}
              onChange={setCarrierId}
            />
          </Field>
          <Field id="ship-tracking" label="เลขพัสดุ">
            <div className="flex gap-2">
              <Input
                id="ship-tracking"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                className="font-mono uppercase"
              />
              <Button type="button" variant="outline" onClick={generate}>
                <RefreshCw />
                สร้างเลข
              </Button>
            </div>
          </Field>
          <Button type="submit">ยืนยันการส่ง</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
