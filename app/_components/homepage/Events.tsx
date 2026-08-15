"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import FilterPill from "../FilterPill";
import MobileFilterBar from "../MobileFilterBar";
import EventCard from "./EventCard";
import EmptyState from "./EmptyState";
import EventModal from "./EventModal";
import ViewToggle from "../ViewToggle";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Button from "../Button";
import { EventDetails } from "@/types";
import { useSearchParams } from "next/navigation";
import { getPostcodeDetails } from "@/app/_utils/getPostcodeDetails";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import {
  EVENT_FILTERS,
  filterEvents,
  SelectableEventFilterId,
} from "@/app/_utils/eventFilters";
import { LatLngExpression } from "leaflet";

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
  const [isLoadingPostcodeDetails, setIsLoadingPostcodeDetails] = useState(
    Boolean(location),
  );
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [postcodeCoordinates, setPostcodeCoordinates] =
    useState<LatLngExpression | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, isLoading, error, data } = useQuery({
    queryKey: ["eventsData"],
    queryFn: getEvents,
  });

  const allEventsData: EventDetails[] = data?.events || [];

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setView("map");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!location) {
      setIsLoadingPostcodeDetails(false);
      setPostcodeCoordinates(null);
      return;
    }
    (async () => {
      try {
        const details = await getPostcodeDetails(location);
        if (mounted) {
          setPostcodeCoordinates([
            details.result.latitude,
            details.result.longitude,
          ]);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setPostcodeCoordinates(null);
      } finally {
        if (mounted) setIsLoadingPostcodeDetails(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location]);

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

  const eventsData = filterEvents(nearbyEvents, selectedFilters);

  const handleToggleFilter = (filter: SelectableEventFilterId) => {
    setSelectedFilters((current) =>
      current.includes(filter)
        ? current.filter((id) => id !== filter)
        : [...current, filter],
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const handleModalOpen = (eventID: string) => {
    const eventToDisplay = eventsData.find((event) => event.id === eventID);
    if (!eventToDisplay) return;
    setSelectedEvent(eventToDisplay);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isPending || isLoading || isLoadingPostcodeDetails) {
    return (
      <div className="mx-auto grid max-w-fit gap-4">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  const resultsHeading = location
    ? `${eventsData.length} events near ${location}`
    : `${eventsData.length} events across the UK`;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="grid gap-4">
        <MobileFilterBar
          selected={selectedFilters}
          onToggle={handleToggleFilter}
          onClear={handleClearFilters}
        />

        <div className="relative hidden md:block">
          <div className="flex w-full gap-2 overflow-x-auto py-2 pr-8">
            {EVENT_FILTERS.map((option) => (
              <FilterPill
                key={option.id}
                filterName={option.label}
                selected={
                  option.id === "all"
                    ? selectedFilters.length === 0
                    : selectedFilters.includes(option.id)
                }
                onClick={() =>
                  option.id === "all"
                    ? handleClearFilters()
                    : handleToggleFilter(option.id)
                }
              />
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-off-white"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-navy md:text-xl lg:text-2xl lg:font-bold">
            {resultsHeading}
          </h2>
          <ViewToggle value={view} onChange={setView} className="shrink-0" />
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

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {eventsData.length > 0 ? (
          <>
            {eventsData
              .slice((currentPage - 1) * 12, currentPage * 12)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  location={location}
                  postcodeCoords={postcodeCoordinates as LatLngExpression}
                  handleModalOpen={handleModalOpen}
                />
              ))}

            {eventsData.length > 12 ? (
              <div className="col-span-full mt-4 flex justify-center gap-4">
                <Button
                  onClick={() => setCurrentPage((page) => page - 1)}
                  isDisabled={currentPage === 1}
                  className="flex w-36 items-center justify-center gap-2 rounded-xl p-2 px-4"
                >
                  <ArrowLeft /> Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((page) => page + 1)}
                  isDisabled={currentPage * 12 >= eventsData.length}
                  className="flex w-36 items-center justify-center gap-2 rounded-xl p-2 px-4"
                >
                  Next <ArrowRight />
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState location={location ?? "this search"} distance={distance} />
        )}
      </section>

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