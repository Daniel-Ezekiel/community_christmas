"use client";

import { ChevronDown, X } from "lucide-react";
import { useIsFetching } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

const DISTANCE_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
];

const UK_POSTCODE = /^(GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/;

function formatSearchInput(value: string) {
  const upper = value.trim().replace(/\s+/g, " ").toUpperCase();
  const compact = upper.replace(/ /g, "");
  if (UK_POSTCODE.test(compact)) {
    return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
  }
  return upper;
}

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const distanceParam = searchParams.get("distance");
  const initialDistance = DISTANCE_OPTIONS.some(
    (option) => option.value === distanceParam,
  )
    ? (distanceParam as string)
    : "10";
  const [distance, setDistance] = useState(initialDistance);
  const [locationInput, setLocationInput] = useState(location);
  const [error, setError] = useState("");
  const [awaitingResults, setAwaitingResults] = useState(false);
  const pendingSearch = useRef<{ location: string; distance: string } | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const eventsFetching = useIsFetching({ queryKey: ["eventsData"] });
  const postcodeFetching = useIsFetching({ queryKey: ["postcodeDetails"] });

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!awaitingResults || !pendingSearch.current) return;
    const pending = pendingSearch.current;
    if (searchParams.get("location") !== pending.location) return;
    if ((searchParams.get("distance") ?? "10") !== pending.distance) return;
    if (eventsFetching > 0 || postcodeFetching > 0) return;
    const timeoutId = window.setTimeout(() => {
      setAwaitingResults(false);
      pendingSearch.current = null;
    }, 100);
    return () => window.clearTimeout(timeoutId);
  }, [awaitingResults, eventsFetching, postcodeFetching, searchParams]);

  const clearSearch = () => {
    setLocationInput("");
    setError("");
    if (location || distanceParam) {
      setDistance("10");
      router.push("/");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = locationInput.trim();
    if (!trimmed) {
      setError("Please enter a postcode or town to search.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Please enter a full postcode or town name.");
      return;
    }

    const formatted = formatSearchInput(locationInput);
    const currentDistance = DISTANCE_OPTIONS.some(
      (option) => option.value === distanceParam,
    )
      ? (distanceParam as string)
      : "10";
    if (formatted === location && distance === currentDistance && location) {
      return;
    }

    setError("");
    setLocationInput(formatted);
    pendingSearch.current = { location: formatted, distance };
    setAwaitingResults(true);
    router.push(
      `/?location=${encodeURIComponent(formatted)}&distance=${encodeURIComponent(distance)}`,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto mt-3 w-full md:mt-4">
      <div className="search-bar flex h-12 min-h-12 w-full min-w-0 items-center overflow-hidden rounded-full bg-white py-1 pl-4 pr-1">
        <label htmlFor="location" className="sr-only">
          Enter postcode or town
        </label>
        <input
          ref={inputRef}
          type="text"
          id="location"
          name="location"
          value={locationInput}
          onChange={(changeEvent) => {
            setLocationInput(changeEvent.target.value);
            if (error) setError("");
          }}
          placeholder="Postcode or town"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-navy placeholder:text-placeholder focus:border-transparent focus:outline-none focus:ring-0"
        />
        {locationInput ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="mr-0.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-mid-grey"
          >
            <X size={16} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        <div className="relative ml-1 hidden shrink-0 md:block">
          <label htmlFor="distance" className="sr-only">
            Search radius
          </label>
          <select
            name="distance"
            id="distance"
            value={distance}
            onChange={(changeEvent) => setDistance(changeEvent.target.value)}
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
        <button
          type="submit"
          disabled={awaitingResults}
          className="search-submit ml-1 h-10 shrink-0 cursor-pointer rounded-full bg-navy px-4 text-sm font-semibold text-white hover:bg-btn-primary-hover focus:ring-2 focus:ring-sage/40 disabled:cursor-not-allowed disabled:bg-light-grey disabled:text-mid-grey disabled:hover:bg-light-grey md:px-6 md:text-base"
        >
          Search
        </button>
      </div>
      <div
        role="radiogroup"
        aria-label="Search radius"
        className="mt-3 flex w-full gap-2 md:hidden"
      >
        {DISTANCE_OPTIONS.map((option) => {
          const selected = distance === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setDistance(option.value)}
              className={
                selected
                  ? "box-border flex h-8 min-h-8 flex-1 cursor-pointer items-center justify-center rounded-pill border border-transparent bg-[#E8A020] px-2 text-sm font-semibold text-white"
                  : "box-border flex h-8 min-h-8 flex-1 cursor-pointer items-center justify-center rounded-pill border border-solid border-[#d1d5db] bg-white px-2 text-sm font-semibold text-[#395460]"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}
    </form>
  );
}
