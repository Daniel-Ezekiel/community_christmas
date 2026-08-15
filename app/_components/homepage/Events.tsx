"use client";

import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import FilterPill from "../FilterPill";
import EventCard from "./EventCard";
import EmptyState from "./EmptyState";
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
  EventFilterId,
  filterEvents,
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

  const [view, setView] = useState<"map" | "list">("map");
  const [activeFilter, setActiveFilter] = useState<EventFilterId>("all");
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

  const eventsData = filterEvents(nearbyEvents, activeFilter);

  const handleFilterChange = (filter: EventFilterId) => {
    setActiveFilter(filter);
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
    <div className="mx-auto max-w-6xl">
      <section className="grid gap-4 sm:grid-cols-2 sm:items-center">
        <div className="flex w-full gap-3 overflow-x-auto py-2 sm:col-span-full">
          {EVENT_FILTERS.map((option) => (
            <FilterPill
              key={option.id}
              filterName={option.label}
              selected={activeFilter === option.id}
              onClick={() => handleFilterChange(option.id)}
            />
          ))}
        </div>

        <h2 className="text-lg font-semibold text-navy md:text-xl lg:py-4 lg:text-2xl lg:font-bold">
          {resultsHeading}
        </h2>

        <ViewToggle value={view} onChange={setView} />

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

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {selectedEvent ? (
        <section
          className={`${isModalOpen ? "fixed top-0 left-0 z-1000" : "hidden"} grid h-dvh w-dvw place-items-center bg-off-white/45 backdrop-blur-sm`}
        >
          <div className="mx-auto h-dvh max-w-270 overflow-scroll bg-off-white">
            <div className="grid gap-4 bg-navy p-4 py-6">
              <button
                onClick={handleModalClose}
                className="flex cursor-pointer items-center gap-2 text-lg font-bold text-sage lg:text-xl"
              >
                <ArrowLeft />
                Back to Results
              </button>
              <h3 className="text-center text-2xl font-extrabold text-white lg:text-4xl">
                {selectedEvent.eventName}
              </h3>
              <div className="flex items-center justify-center gap-4">
                <FilterPill filterName="Free" />
                <FilterPill filterName="Accessible" />
              </div>
            </div>

            <div className="flex flex-col gap-6 p-4 py-8 md:grid md:gap-4 md:px-10 lg:grid-cols-9 lg:px-12">
              <h4 className="col-span-full text-lg font-bold text-sage uppercase md:text-xl">
                Hosted by {selectedEvent.organisation}
              </h4>

              <div className="grid gap-3 lg:col-span-4 lg:grid-cols-2">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 text-lg md:text-xl lg:col-span-full">
                  <MapPin className="self-end text-sage" />
                  <h5 className="col-start-2 self-end font-bold text-navy">
                    {selectedEvent.venueName}
                  </h5>
                  <p className="col-start-2">
                    {selectedEvent.address}, {selectedEvent.city},{" "}
                    {selectedEvent.postcode}
                  </p>
                </div>

                <div className="text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Date</h5>
                  <p>
                    {selectedEvent.isChristmasDay === "Yes"
                      ? "Christmas Day, 25 December"
                      : selectedEvent.lastUpdated}
                  </p>
                </div>

                <div className="text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Time</h5>
                  <p>{selectedEvent.time}</p>
                </div>

                <div className="text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Event Type</h5>
                  <p>{selectedEvent.eventType}</p>
                </div>

                <div className="text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Distance</h5>
                  <p>
                    {location && postcodeCoordinates
                      ? `${calculateDistanceInMiles(
                          postcodeCoordinates as number[],
                          selectedEvent.coordinates.latLng as number[],
                        ).toFixed(1)} miles`
                      : selectedEvent.postcode}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-chip lg:col-span-5 lg:col-start-5 lg:row-start-2">
                <EventsMap
                  events={[selectedEvent]}
                  location={location}
                  postcodeCoords={postcodeCoordinates as LatLngExpression}
                  position={selectedEvent.coordinates.latLng}
                  zoom={20}
                  isForModal={true}
                  height="300px"
                />
              </div>

              <div className="col-span-full text-lg text-navy md:text-xl">
                <h5 className="font-bold uppercase">About this Event</h5>
                <p>{selectedEvent.description}</p>
              </div>

              <div className="col-span-full rounded-chip bg-light-sage p-4 text-lg text-navy md:text-xl">
                <h5 className="mb-4 font-bold uppercase">Accessibility</h5>
                <p>{selectedEvent.accessibility}</p>
              </div>

              <div className="col-span-full text-lg text-navy md:text-xl">
                <h5 className="font-bold uppercase">Cost</h5>
                <span>{selectedEvent.cost}</span>
              </div>

              <div className="col-span-full text-lg text-navy md:text-xl">
                <div className="rounded-chip bg-warning-fill p-4 text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Booking</h5>
                  <span>{selectedEvent.bookingRequired}</span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Button
                    variant="secondary"
                    type="button"
                    className="rounded-chip border border-sage p-4 text-lg font-bold text-navy lg:text-xl"
                  >
                    {selectedEvent.contactPublic.split("\n")[0]}
                  </Button>

                  <Button
                    variant="secondary"
                    type="button"
                    className="rounded-chip border border-sage p-4 text-lg font-bold text-navy lg:text-xl"
                  >
                    {selectedEvent.contactPublic.split("\n")[1]}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}