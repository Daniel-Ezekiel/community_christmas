"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import FilterPill from "../FilterPill";
import MobileFilterBar from "../MobileFilterBar";
import EventCard from "./EventCard";
import EmptyState from "./EmptyState";
import EventModal from "./EventModal";
import StatusPanel from "./StatusPanel";
import ViewToggle from "../ViewToggle";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Button from "../Button";
import { EventDetails } from "@/types";
import { useSearchParams } from "next/navigation";
import { getPostcodeDetails } from "@/app/_utils/getPostcodeDetails";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import {
  EVENT_FILTERS,
  EventFilterId,
  filterEvents,
  SelectableEventFilterId,
} from "@/app/_utils/eventFilters";
import { LatLngExpression } from "leaflet";

function formatEventCount(count: number) {
  return `${count} ${count === 1 ? "event" : "events"}`;
}

function getResultsHeading(
  count: number,
  location: string | null,
  distance: string | null,
  searchedNearby: boolean,
) {
  if (searchedNearby && location && distance) {
    return `${formatEventCount(count)} within ${distance} miles of ${location}`;
  }
  if (location) {
    return `${formatEventCount(count)} near ${location}`;
  }
  return `${formatEventCount(count)} across the UK`;
}

const EventsMap = dynamic(
  () => import("@/app/_components/homepage/EventsMap"),
  {
    loading: () => <p>The Events Map is loading...</p>,
    ssr: false,
  },
);

const getEvents = async () => {
  const res = await fetch("/api/events/");
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
  return res.json();
};

export default function Events() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const distance = searchParams.get("distance");

  const [view, setView] = useState<"map" | "list">("list");
  const [selectedFilters, setSelectedFilters] = useState<
    SelectableEventFilterId[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, isLoading, error, data, refetch, isFetching } = useQuery({
    queryKey: ["eventsData"],
    queryFn: getEvents,
  });

  const { data: postcodeDetails, isFetching: isFetchingPostcode } = useQuery({
    queryKey: ["postcodeDetails", location],
    queryFn: async () => {
      try {
        return await getPostcodeDetails(location as string);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    enabled: Boolean(location),
    retry: false,
  });

  const isLoadingPostcodeDetails = Boolean(location) && isFetchingPostcode;
  const postcodeCoordinates: LatLngExpression | null = postcodeDetails
    ? [postcodeDetails.result.latitude, postcodeDetails.result.longitude]
    : null;

  const allEventsData: EventDetails[] = data?.events || [];

  const nearbyEvents =
    location && distance && postcodeCoordinates
      ? allEventsData.filter((event) => {
          const coords = event.coordinates.latLng;
          if (!Array.isArray(coords)) return false;
          return (
            calculateDistanceInMiles(
              postcodeCoordinates as number[],
              coords as number[],
            ) <= Number(distance)
          );
        })
      : allEventsData;
  const searchedNearby = Boolean(location && distance && postcodeCoordinates);

  const eventsData = filterEvents(nearbyEvents, selectedFilters);

  const allEventsSelected = selectedFilters.length === 0;

  const handleFilterClick = (id: EventFilterId) => {
    if (id === "all") {
      setSelectedFilters([]);
      setCurrentPage(1);
      return;
    }

    setSelectedFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setCurrentPage(1);
  };

  const handleToggleFilter = (filter: SelectableEventFilterId) => {
    handleFilterClick(filter);
  };

  const handleClearFilters = () => {
    handleFilterClick("all");
  };

  const handleModalOpen = (eventID: string) => {
    const eventToDisplay = eventsData.find((event) => event.id === eventID);
    if (!eventToDisplay) return;
    setSelectedEvent(eventToDisplay);
    setIsModalOpen(true);
  };

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  if (isPending || isLoading || isLoadingPostcodeDetails) {
    return (
      <StatusPanel
        variant="loading"
        title="Looking for events near you..."
        description="This may take a moment."
      />
    );
  }

  if (error) {
    return (
      <StatusPanel
        variant="error"
        title="We couldn't load events"
        description="Please try again. If it keeps happening, check back a little later."
        detail={error.message}
      >
        <Button
          onClick={() => {
            void refetch();
          }}
          isDisabled={isFetching}
          className="inline-flex min-h-11 w-fit items-center rounded-pill px-10"
        >
          Try again
        </Button>
      </StatusPanel>
    );
  }

  const resultsHeading = getResultsHeading(
    eventsData.length,
    location,
    distance,
    searchedNearby,
  );

  return (
    <div className="w-full mx-auto max-w-300">
      <section className="grid gap-4">
        <MobileFilterBar
          selected={selectedFilters}
          onToggle={handleToggleFilter}
          onClear={handleClearFilters}
        />

        <div className="relative hidden md:flex md:items-center md:gap-3">
          <div className="relative min-w-0 flex-1">
            <div className="flex w-full gap-2 overflow-x-auto py-2 lg:pr-8">
              {EVENT_FILTERS.map((option) => {
                const isAll = option.id === "all";
                const isSelected = isAll
                  ? allEventsSelected
                  : selectedFilters.includes(option.id);

                return (
                  <FilterPill
                    key={option.id}
                    filterName={option.label}
                    selected={isSelected}
                    onClick={() => handleFilterClick(option.id)}
                  />
                );
              })}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-off-white"
            />
          </div>
          {allEventsSelected ? null : (
            <button
              type="button"
              onClick={handleClearFilters}
              className="shrink-0 cursor-pointer text-[13px] text-navy underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-navy md:min-w-0 md:flex-1 md:truncate md:text-xl lg:text-2xl lg:font-bold">
            {searchedNearby && location && distance ? (
              <>
                <span className="md:hidden">
                  {formatEventCount(eventsData.length)} within {distance} miles
                  of
                  <span className="mt-0.5 block">{location}</span>
                </span>
                <span className="hidden md:inline">{resultsHeading}</span>
              </>
            ) : (
              resultsHeading
            )}
          </h2>
          <ViewToggle
            value={view}
            onChange={setView}
            className="shrink-0 self-start md:self-auto"
          />
        </div>

        {eventsData.length > 0 && view === "map" ? (
          <div className="col-span-full overflow-hidden rounded-card">
            <EventsMap
              position={[54.0, -2.5]}
              zoom={5}
              location={location}
              postcodeCoords={postcodeCoordinates as LatLngExpression}
              events={eventsData}
              handleModalOpen={handleModalOpen}
            />
          </div>
        ) : null}
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {view === "list" && (
          <>
            {eventsData.length > 0 ? (
              eventsData
                .slice((currentPage - 1) * 12, currentPage * 12)
                .map((event) => (
                  <EventCard
                    key={`${event.id}-${selectedFilters.join(",")}-${currentPage}-${location}-${distance}`}
                    event={event}
                    location={location}
                    postcodeCoords={postcodeCoordinates as LatLngExpression}
                    handleModalOpen={handleModalOpen}
                    className="results-card"
                  />
                ))
            ) : (
              <EmptyState
                location={location ?? "this search"}
                distance={distance}
              />
            )}
          </>
        ) }
      </section>

      {eventsData.length > 12 && view === "list" ? (
        <div className="mt-4 mb-10 border-t border-[#e5e7eb] pt-4">
          <p className="text-center text-[14px] text-mid-grey">
            Showing {(currentPage - 1) * 12 + 1}–
            {Math.min(currentPage * 12, eventsData.length)} of{" "}
            {eventsData.length} events
          </p>
          <div className="mt-4 flex justify-center gap-4">
            {currentPage > 1 ? (
              <Button
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex w-36 items-center justify-center gap-2 rounded-xl p-2 px-4"
              >
                <ArrowLeft /> Previous
              </Button>
            ) : null}
            <Button
              onClick={() => setCurrentPage((page) => page + 1)}
              isDisabled={currentPage * 12 >= eventsData.length}
              className="flex w-36 items-center justify-center gap-2 rounded-xl p-2 px-4"
            >
              Next <ArrowRight />
            </Button>
          </div>
        </div>
      ) : null}

      {selectedEvent && isModalOpen ? (
        <EventModal
          event={selectedEvent}
          location={location}
          postcodeCoords={postcodeCoordinates as LatLngExpression}
          onClose={handleModalClose}
        />
      ) : null}
    </div>
  );
}
