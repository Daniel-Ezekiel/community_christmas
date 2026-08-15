"use client";

import { useEffect, useId, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { EventDetails } from "@/types";
import { LatLngExpression } from "leaflet";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import { isAccessibleEvent, isFreeEvent } from "@/app/_utils/eventFilters";
import FilterPill from "../FilterPill";

const EventsMap = dynamic(
  () => import("@/app/_components/homepage/EventsMap"),
  { ssr: false },
);

function contactParts(contactPublic: string) {
  const [phone, email] = contactPublic.split("\n").map((part) => part.trim());
  return { phone, email };
}

export default function EventModal({
  event,
  location,
  postcodeCoords,
  onClose,
}: {
  event: EventDetails;
  location: string | null;
  postcodeCoords?: LatLngExpression;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const free = isFreeEvent(event);
  const accessible = isAccessibleEvent(event);
  const { phone, email } = contactParts(event.contactPublic);
  const origin = Array.isArray(postcodeCoords)
    ? (postcodeCoords as number[])
    : null;
  const destination = Array.isArray(event.coordinates.latLng)
    ? (event.coordinates.latLng as number[])
    : null;
  const distanceLabel =
    location && origin && destination
      ? `${calculateDistanceInMiles(origin, destination).toFixed(1)} miles away`
      : event.postcode;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
        return;
      }
      if (keyboardEvent.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (keyboardEvent.shiftKey && document.activeElement === first) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-1000 grid place-items-end bg-navy/40 backdrop-blur-sm md:place-items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-dvh w-full max-w-3xl flex-col overflow-y-auto bg-off-white md:h-[min(90dvh,900px)] md:rounded-card"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative bg-navy px-4 py-6 text-white md:px-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 font-bold text-sage"
          >
            <ArrowLeft size={20} aria-hidden />
            Back to results
          </button>
          <h2
            id={titleId}
            className="mt-4 text-center text-2xl font-extrabold lg:text-4xl"
          >
            {event.eventName}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {free ? (
              <FilterPill filterName="Free" selected />
            ) : (
              <FilterPill filterName="Paid" selected />
            )}
            {accessible ? (
              <span className="inline-flex min-h-11 items-center rounded-pill border border-white/40 px-3 text-sm font-medium text-white">
                Accessible
              </span>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-6 px-4 py-8 md:px-10">
          <p className="text-sm font-bold tracking-wide text-sage uppercase">
            Hosted by {event.organisation}
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex gap-2 text-navy">
              <MapPin className="mt-1 shrink-0 text-sage" aria-hidden />
              <div>
                <h3 className="font-bold">{event.venueName}</h3>
                <p>
                  {event.address}, {event.city}, {event.postcode}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-chip">
              <EventsMap
                events={[event]}
                location={location}
                postcodeCoords={postcodeCoords}
                position={event.coordinates.latLng}
                zoom={16}
                isForModal
                height="220px"
              />
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-bold text-navy uppercase">Date</dt>
              <dd>
                {event.isChristmasDay === "Yes"
                  ? "Christmas Day, 25 December"
                  : event.lastUpdated}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy uppercase">Time</dt>
              <dd>{event.time}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy uppercase">Event type</dt>
              <dd>{event.eventType}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy uppercase">Distance</dt>
              <dd>{distanceLabel}</dd>
            </div>
          </dl>

          <section>
            <h3 className="font-bold text-navy uppercase">About this event</h3>
            <p className="mt-1 text-navy">{event.description}</p>
          </section>

          <section className="rounded-chip bg-light-sage p-4">
            <h3 className="font-bold text-navy uppercase">Accessibility</h3>
            <p className="mt-1 text-navy">{event.accessibility}</p>
          </section>

          <section>
            <h3 className="font-bold text-navy uppercase">Cost</h3>
            <p className="mt-1 text-navy">{event.cost}</p>
          </section>

          <section className="rounded-chip bg-warning-fill p-4">
            <h3 className="font-bold text-navy uppercase">Booking</h3>
            <p className="mt-1 text-navy">{event.bookingRequired}</p>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-chip border border-sage font-bold text-navy"
              >
                <Phone size={18} aria-hidden />
                {phone}
              </a>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-chip border border-sage font-bold text-navy"
              >
                <Mail size={18} aria-hidden />
                Email
              </a>
            ) : null}
          </div>

          <p className="text-center text-sm text-mid-grey">
            You will be contacting {event.organisation} directly.
          </p>
        </div>
      </div>
    </div>
  );
}