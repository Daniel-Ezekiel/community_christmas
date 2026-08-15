"use client";

import { List, Map } from "lucide-react";
import { cn } from "../_utils/cn";

type ViewMode = "map" | "list";

export default function ViewToggle({
  value,
  onChange,
  className,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}) {
  const options: { id: ViewMode; label: string; icon: typeof Map }[] = [
    { id: "map", label: "Map", icon: Map },
    { id: "list", label: "List", icon: List },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => onChange(value === "list" ? "map" : "list")}
        aria-label={
          value === "list" ? "Switch to map view" : "Switch to list view"
        }
        className={cn(
          "inline-flex min-h-10 cursor-pointer items-center rounded-pill border border-card-border bg-navy px-4 text-sm font-semibold text-white md:hidden",
          className,
        )}
      >
        {value === "list" ? "List view" : "Map view"}
      </button>

      <div
        role="group"
        aria-label="Results view"
        className={cn(
          "hidden grid-cols-2 rounded-pill border border-card-border bg-white p-1 md:grid",
          className ?? "w-full max-w-72 justify-self-end",
        )}
      >
        {options.map(({ id, label, icon: Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-pill px-3 font-semibold transition-colors",
                selected ? "bg-navy text-white" : "bg-white text-navy",
              )}
            >
              <Icon size={18} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}