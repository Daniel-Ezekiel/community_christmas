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
        "filter-chip inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-pill border font-medium",
        "px-3 py-[6px] text-[13px] leading-tight md:min-h-8 md:px-3 md:py-1 md:text-sm md:leading-normal",
        selected
          ? "border-sage bg-light-sage text-navy"
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
