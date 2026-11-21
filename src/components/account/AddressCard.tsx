"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AddressBlock } from "@/components/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShopStore } from "@/store";
import type { User } from "@/types";
import { AddressForm } from "./AddressForm";

export function AddressCard({ user }: { user: User }) {
  const updateProfile = useShopStore((state) => state.updateProfile);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-0 flex-1">
        {user.address ? (
          <AddressBlock address={user.address} />
        ) : (
          <p className="text-muted-foreground text-sm">ยังไม่มีที่อยู่จัดส่ง</p>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {user.address ? "เปลี่ยน" : "เพิ่มที่อยู่"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ที่อยู่จัดส่ง</DialogTitle>
          </DialogHeader>
          <AddressForm
            initial={user.address}
            submitLabel="บันทึกที่อยู่"
            onSave={(address) => {
              const result = updateProfile({
                name: user.name,
                phone: user.phone,
                address,
              });
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
