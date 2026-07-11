"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ViewMode = "grid" | "list";

export interface ViewToggleProps {
  /** Defaults to reading `?view=` from the URL, falling back to "grid". */
  value?: ViewMode;
}

export function ViewToggle({ value }: ViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current: ViewMode =
    value ?? (searchParams.get("view") === "list" ? "list" : "grid");

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (next === "grid") {
      params.delete("view");
    } else {
      params.set("view", next);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-32" aria-label="Alternar visualização">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="grid">Grade</SelectItem>
        <SelectItem value="list">Lista</SelectItem>
      </SelectContent>
    </Select>
  );
}
