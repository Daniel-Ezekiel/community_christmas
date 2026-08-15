"use client";

import { Check } from "lucide-react";
import { cn } from "../_utils/cn";

export default function FilterPill({
  filterName,
  selected = false,
  onClick,
}: {
  filterName: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 min-w-max items-center gap-1 rounded-pill border px-3 text-sm font-medium transition-colors cursor-pointer",
        selected
          ? "border-navy bg-light-sage text-navy"
          : "border-card-border bg-white text-navy hover:bg-hover-tint",
      )}
    >
      {selected ? <Check size={14} aria-hidden /> : null}
      {filterName}
    </button>
  );
}