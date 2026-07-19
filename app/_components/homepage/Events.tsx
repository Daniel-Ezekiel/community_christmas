"use client";

import { List, Map } from "lucide-react";
import FilterPill from "../FilterPill";
import EventCard from "./EventCard";
import { useQuery } from "@tanstack/react-query";
// import EventsMap from "./EventsMap";
import dynamic from "next/dynamic";

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
    const res = await fetch(`/api`, {
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

  const { isPending, error, data } = useQuery({
    queryKey: ["eventsData"],
    queryFn: getEvents,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const eventsData: EventDetails[] | [] = data?.events || [];

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
          <EventsMap position={[51.505, -0.09]} zoom={13} events={eventsData} />
        </div>
      </section>

      <section className="mt-8 grid gap-4 place-items-center md:grid-cols-2 md:place-items-stretch lg:grid-cols-3">
        {eventsData.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
    </div>
  );
}
