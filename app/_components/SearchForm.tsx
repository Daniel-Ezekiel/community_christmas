"use client";

import { useSearchParams } from "next/navigation";
import Button from "./Button";

const DISTANCE_OPTIONS = ["5", "10", "15", "20", "25"];

export default function SearchForm() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const distance = searchParams.get("distance") ?? "10";

  return (
    <form
      action="/"
      method="GET"
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <div className="flex min-h-12 flex-1 items-center gap-2 rounded-input bg-white px-3 py-1">
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
        <select
          name="distance"
          id="distance"
          defaultValue={DISTANCE_OPTIONS.includes(distance) ? distance : "10"}
          className="min-h-11 shrink-0 rounded-pill border border-sage bg-amber px-3 text-xs font-semibold text-amber-dark focus:ring-2 focus:ring-sage/35"
        >
          {DISTANCE_OPTIONS.map((miles) => (
            <option key={miles} value={miles}>
              Within {miles} mi
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="primary"
        type="submit"
        className="min-h-12 w-full rounded-pill sm:w-auto sm:px-10 lg:bg-white lg:text-navy lg:hover:bg-hover-tint"
      >
        Search
      </Button>
    </form>
  );
}