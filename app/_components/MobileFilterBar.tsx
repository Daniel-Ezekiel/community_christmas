"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterPill from "./FilterPill";
import { cn } from "../_utils/cn";
import {
  MORE_EVENT_FILTERS,
  SelectableEventFilterId,
} from "../_utils/eventFilters";

export default function MobileFilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: readonly SelectableEventFilterId[];
  onToggle: (filter: SelectableEventFilterId) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const showingAll = selected.length === 0;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="md:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "filter-chip inline-flex min-h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-pill border px-2.5 text-sm font-medium",
            !showingAll || open
              ? "border-navy bg-light-sage text-navy"
              : "border-card-border bg-white text-navy hover:bg-hover-tint",
          )}
        >
          <SlidersHorizontal size={14} aria-hidden />
          Filters
          {selected.length > 0 ? (
            <span className="rounded-pill bg-navy px-1.5 text-sm font-semibold text-white">
              {selected.length}
            </span>
          ) : null}
        </button>
        {showingAll ? null : (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-sm text-navy font-semibold underline"
          >
            Clear all
          </button>
        )}
      </div>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Filters"
          className="mt-2 rounded-card border border-card-border bg-white p-2"
        >
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              filterName="All events"
              selected={showingAll}
              onClick={onClear}
            />
            {MORE_EVENT_FILTERS.map((option) => (
              <FilterPill
                key={option.id}
                filterName={option.label}
                selected={selected.includes(option.id)}
                onClick={() => onToggle(option.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
