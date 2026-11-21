"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field, OptionSelect } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRACKING_PRESETS } from "@/constants";
import { useShopStore } from "@/store";
import type { Order } from "@/types";

export function TrackingUpdateForm({ order }: { order: Order }) {
  const addTrackingEvent = useShopStore((state) => state.addTrackingEvent);
  const [description, setDescription] = useState(TRACKING_PRESETS[0]);
  const [location, setLocation] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = addTrackingEvent(order.id, location, description);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("อัปเดตสถานะพัสดุแล้ว");
    setLocation("");
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-md border border-dashed p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <Field id="tracking-description" label="สถานะพัสดุ">
        <OptionSelect
          id="tracking-description"
          value={description}
          options={TRACKING_PRESETS.map((preset) => ({
            value: preset,
            label: preset,
          }))}
          onChange={setDescription}
        />
      </Field>
      <Field id="tracking-location" label="สถานที่">
        <Input
          id="tracking-location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder={`เช่น ศูนย์คัดแยก ${order.address.province}`}
        />
      </Field>
      <Button type="submit" variant="outline">
        เพิ่มสถานะ
      </Button>
    </form>
  );
}
