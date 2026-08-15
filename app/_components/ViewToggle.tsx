"use client";

import { List, Map } from "lucide-react";
import { cn } from "../_utils/cn";

type ViewMode = "map" | "list";

export default function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  const options: { id: ViewMode; label: string; icon: typeof Map }[] = [
    { id: "map", label: "Map", icon: Map },
    { id: "list", label: "List", icon: List },
  ];

  return (
    <div
      role="group"
      aria-label="Results view"
      className="w-full p-1 border border-card-border bg-white rounded-pill grid grid-cols-2 sm:max-w-72 sm:justify-self-end"
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
              "min-h-11 px-3 flex items-center justify-center gap-2 font-semibold rounded-pill transition-colors cursor-pointer",
              selected ? "bg-navy text-white" : "bg-white text-navy",
            )}
          >
            <Icon size={18} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}