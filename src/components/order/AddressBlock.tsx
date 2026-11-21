import type { Address } from "@/types";

export function AddressBlock({ address }: { address: Address }) {
  return (
    <div className="text-sm">
      <p className="font-medium">
        {address.recipient}{" "}
        <span className="font-normal text-muted-foreground">
          {address.phone}
        </span>
      </p>
      <p className="text-muted-foreground">
        {address.line} {address.district} {address.province} {address.postcode}
      </p>
    </div>
  );
}
