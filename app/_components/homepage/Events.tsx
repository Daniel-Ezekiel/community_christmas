"use client";

import { ArrowLeft, List, Map, MapPin } from "lucide-react";
import FilterPill from "../FilterPill";
import EventCard from "./EventCard";
import { useQuery } from "@tanstack/react-query";
// import EventsMap from "./EventsMap";
import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "../Button";
import { EventDetails } from "@/types";
import { PulseLoader } from "react-spinners";

const EventsMap = dynamic(
  () => import("@/app/_components/homepage/EventsMap"),
  {
    loading: () => <p>The Events Map is loading...</p>,
    ssr: false,
  },
);

const getEvents = async () => {
  //   const url =
  //     process.env.NODE_ENV === "production"
  //       ? process.env.NEXT_PUBLIC_PROD_URL
  //       : process.env.NEXT_PUBLIC_LOCAL_URL;

  //       console.log(process.env.NODE_ENV, process.env.NEXT_PUBLIC_PROD_URL, process.env.NEXT_PUBLIC_LOCAL_URL)

  try {
    const res = await fetch(`/api/events/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);

    const events = await res.json();
    return events;
  } catch (err) {
    console.log(`Failed to fetch events: ${err}`);
  }
};

export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);

  const { isPending, isLoading, error, data } = useQuery({
    queryKey: ["eventsData"],
    queryFn: getEvents,
  });

  const eventsData: EventDetails[] | [] = data?.events || [];

  const filterOptions = [
    "All Events",
    "Free only",
    "Accessible",
    "Spaces left",
    "Booking req.",
    "Lunch",
    "Dinner",
    "Activity",
  ];

  const handleModalOpen = (eventID: string) => {
    setIsModalOpen(true);
    const eventToDisplay = eventsData.find((event) => event.id === eventID);
    if (eventToDisplay?.id) {
      setSelectedEvent(eventToDisplay);
    } else return;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isPending || isLoading)
    return (
      <div className="max-w-fit mx-auto grid gap-4">
       <p className="text-center"> Loading...</p>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="max-w-300 mx-auto">
      <section className="grid gap-4 sm:grid-cols-2 sm:items-center sm:gap-y-4">
        <div className="w-full py-2 flex gap-3 overflow-scroll sm:col-span-full lg:overflow-auto">
          {filterOptions.map((option, idx) => {
            return <FilterPill key={idx} filterName={option} />;
          })}
        </div>

        <h2 className="font-semibold text-lg md:text-xl lg:text-2xl lg:font-bold lg:py-6 xl:text-4xl">
          4 Events near <span>Bristol</span>
        </h2>

        <div className="w-full p-1 border border-card-border bg-white rounded-full grid grid-cols-2 sm:max-w-90 sm:justify-self-end">
          <button
            className={`p-1 flex items-center justify-center gap-2 text-center bg-navy font-semibold rounded-full text-white`}
          >
            <Map /> Map
          </button>
          <button
            className={`p-2 flex items-center justify-center gap-2 text-center`}
          >
            <List /> List
          </button>
        </div>

        <div className="col-span-full">
          <EventsMap
            position={[54.0, -2.5]}
            zoom={5}
            events={eventsData}
            handleModalOpen={handleModalOpen}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:place-items-stretch lg:grid-cols-3">
        {eventsData.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            handleModalOpen={handleModalOpen}
          />
        ))}
      </section>

      {selectedEvent && (
        <section
          className={`${isModalOpen ? "fixed top-0 left-0 z-1000" : "hidden"} bg-off-white/45 backdrop-blur-sm h-dvh w-dvw grid place-items-center transition-all ease-in-out duration-300`}
        >
          {!selectedEvent ? (
            <p className="grid">
              <button
                onClick={handleModalClose}
                className="flex gap-2 items-center cursor-pointer font-bold text-sage text-lg lg:text-xl"
              >
                <ArrowLeft />
                Back to Results
              </button>
              Failed to display event details. Invalid Event ID
            </p>
          ) : (
            <div className="bg-off-white h-dvh overflow-scroll max-w-270 mx-auto">
              <div className="bg-navy p-4 py-6 grid gap-4">
                <button
                  onClick={handleModalClose}
                  className="flex gap-2 items-center cursor-pointer font-bold text-sage text-lg lg:text-xl"
                >
                  <ArrowLeft />
                  Back to Results
                </button>
                <h3 className="text-white text-2xl text-center font-extrabold lg:text-4xl">
                  {selectedEvent.eventName}{" "}
                </h3>
                <div className="flex justify-center items-center gap-4">
                  <FilterPill filterName="Free" />
                  <FilterPill filterName="Accessible" />
                </div>
              </div>

              <div className="p-4 py-8 flex flex-col gap-6 md:grid md:gap-4 md:px-10 lg:px-12 lg:grid-cols-9">
                <h4 className="text-lg text-sage font-bold uppercase col-span-full md:text-xl">
                  Hosted by {selectedEvent.organisation}
                </h4>

                <div className="grid gap-3 lg:col-span-4 lg:grid-cols-2">
                  <div className="text-lg grid grid-cols-[auto_1fr] grid-rows-[fit-content_fit-content] gap-x-2 md:text-xl lg:col-span-full">
                    <MapPin className="text-sage self-end" />
                    <h5 className="text-navy font-bold col-start-2 self-end">
                      {selectedEvent.venueName}
                    </h5>
                    <p className="col-start-2 self-start">
                      {selectedEvent.address}, {selectedEvent.city},{" "}
                      {selectedEvent.postcode}
                    </p>
                  </div>

                  <div className="text-lg text-navy md:text-xl ">
                    <h5 className="font-bold uppercase">Date</h5>
                    <p>
                      {selectedEvent.isChristmasDay &&
                        "Christmas Day, 25 December"}
                    </p>
                  </div>

                  <div className="text-lg text-navy md:text-xl ">
                    <h5 className="font-bold uppercase">Time</h5>
                    <p>{selectedEvent.time}</p>
                  </div>

                  <div className="text-lg text-navy md:text-xl ">
                    <h5 className="font-bold uppercase">Event Type</h5>
                    <p>{selectedEvent.eventType}</p>
                  </div>

                  <div className="text-lg text-navy md:text-xl ">
                    <h5 className="font-bold uppercase">Distance</h5>
                    <p>0.4 Miles</p>
                  </div>
                </div>

                <div className="rounded-chip overflow-hidden lg:col-span-5 lg:col-start-5 lg:row-start-2">
                  <EventsMap
                    events={[selectedEvent]}
                    position={selectedEvent.coordinates.latLng}
                    zoom={20}
                    isForModal={true}
                    height="300px"
                  />
                </div>

                <div className=" col-span-full text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">About this Event</h5>
                  <p>{selectedEvent.description}</p>
                </div>

                <div className=" col-span-full text-lg text-navy bg-light-sage rounded-chip p-4 md:text-xl">
                  <h5 className="font-bold uppercase mb-4">Accessibility</h5>
                  <p>{selectedEvent.accessibility}</p>
                </div>

                <div className=" col-span-full text-lg text-navy md:text-xl">
                  <h5 className="font-bold uppercase">Cost</h5>
                  <span>{selectedEvent.cost}</span>
                </div>

                <div className=" col-span-full text-lg text-navy md:text-xl">
                  <div className="p-4 bg-[#fefddb] text-lg text-navy rounded-chip md:text-xl">
                    <h5 className="font-bold uppercase bg-light-amber rounded-chip">
                      Booking
                    </h5>
                    <span>{selectedEvent.bookingRequired}</span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Button
                      variant="secondary"
                      type="button"
                      className="border border-sage p-4 rounded-chip text-navy text-lg font-bold lg:text-xl"
                    >
                      {selectedEvent.contactPublic.split("\n")[0]}
                    </Button>

                    <Button
                      variant="secondary"
                      type="button"
                      className="border border-sage p-4 rounded-chip text-navy text-lg font-bold lg:text-xl"
                    >
                      {selectedEvent.contactPublic.split("\n")[1]}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
