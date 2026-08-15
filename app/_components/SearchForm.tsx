"use client";

import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const DISTANCE_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "15", label: "15 miles" },
  { value: "20", label: "20 miles" },
  { value: "25", label: "25 miles" },
];

export default function SearchForm() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const distanceParam = searchParams.get("distance");
  const initialDistance = DISTANCE_OPTIONS.some(
    (option) => option.value === distanceParam,
  )
    ? (distanceParam as string)
    : "10";
  const [distance, setDistance] = useState(initialDistance);

  return (
    <form
      action="/"
      method="GET"
      className="mx-auto mt-4 flex w-full max-w-xl flex-col gap-3 md:mt-6 md:flex-row md:items-center"
    >
      <div className="flex h-12 min-h-12 w-full items-center rounded-full bg-white pl-4 pr-1 md:flex-1">
        <label htmlFor="location" className="sr-only">
          Enter postcode or town
        </label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={location}
          placeholder="Enter postcode or town..."
          className="min-w-0 flex-1 bg-transparent text-base text-navy placeholder:text-placeholder focus:outline-none"
        />
        <label htmlFor="distance" className="sr-only">
          Search radius
        </label>
        <div className="relative ml-2 shrink-0">
          <select
            name="distance"
            id="distance"
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
            className="h-9 appearance-none rounded-full bg-amber py-0 pl-3 pr-7 text-sm font-semibold text-amber-dark focus:outline-none focus:ring-2 focus:ring-sage/40"
          >
            {DISTANCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-amber-dark"
          />
        </div>
      </div>
      <button
        type="submit"
        className="h-12 min-h-12 w-full cursor-pointer rounded-full bg-white px-8 text-base font-semibold text-navy hover:bg-hover-tint focus:ring-2 focus:ring-sage/40 md:w-auto"
      >
        Search
      </button>
    </form>
  );
}