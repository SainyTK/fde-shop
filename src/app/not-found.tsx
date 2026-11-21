import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <EmptyState
        icon={SearchX}
        title="ไม่พบหน้าที่ต้องการ"
        action={
          <Button nativeButton={false} render={<Link href="/" />}>
            กลับหน้าแรก
          </Button>
        }
      />
    </main>
  );
}
