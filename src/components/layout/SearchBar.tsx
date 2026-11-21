"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [text, setText] = useState(params.get("q") ?? "");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (text.trim()) {
      query.set("q", text.trim());
    }
    router.push(`/search?${query.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex h-10 flex-1 items-center rounded-sm bg-white p-1 shadow-sm"
    >
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="ค้นหาสินค้า แบรนด์ หรือร้านค้า"
        aria-label="ค้นหาสินค้า"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-foreground text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="flex h-full items-center justify-center rounded-sm bg-primary px-4 text-white transition-colors hover:bg-primary/90 sm:px-6"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
