"use client";

import { useState } from "react";
import { SLIP_MAX_WIDTH } from "@/constants";
import { compressImage, type ScanStep, scanSlip } from "@/services";
import { useShopStore } from "@/store";
import type { Order, SlipCheck } from "@/types";
import { evaluateSlip, usedSlipReferences } from "@/utils";

export type SlipVerification =
  | { phase: "idle" }
  | { phase: "scanning"; step: ScanStep; image: string }
  | { phase: "checked"; image: string; check: SlipCheck }
  | { phase: "error"; message: string };

export function useSlipVerification(order: Order) {
  const [state, setState] = useState<SlipVerification>({ phase: "idle" });

  const verify = async (file: File) => {
    try {
      const image = await compressImage(file, SLIP_MAX_WIDTH);
      setState({ phase: "scanning", step: "qr", image });
      const scan = await scanSlip(image, (step) =>
        setState({ phase: "scanning", step, image }),
      );
      const check = evaluateSlip(
        scan,
        order.total,
        usedSlipReferences(useShopStore.getState().data),
      );
      setState({ phase: "checked", image, check });
    } catch (error) {
      setState({
        phase: "error",
        message: error instanceof Error ? error.message : "ตรวจสลิปไม่สำเร็จ",
      });
    }
  };

  const reset = () => setState({ phase: "idle" });

  return { state, verify, reset };
}
