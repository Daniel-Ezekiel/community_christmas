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
        "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-pill border font-medium transition-colors",
        "min-h-8 px-2.5 text-xs md:min-h-11 md:px-3 md:text-sm",
        selected
          ? "border-navy bg-light-sage text-navy"
          : "border-card-border bg-white text-navy hover:bg-hover-tint",
      )}
    >
      {selected ? (
        <Check size={12} aria-hidden className="md:size-3.5" />
      ) : null}
      {filterName}
    </button>
  );
}
