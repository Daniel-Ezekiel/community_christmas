"use client";

import { useEffect, useId, useRef } from "react";
import dynamic from "next/dynamic";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { EventDetails } from "@/types";
import { LatLngExpression } from "leaflet";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import { isAccessibleEvent, isFreeEvent } from "@/app/_utils/eventFilters";

const EventsMap = dynamic(
  () => import("@/app/_components/homepage/EventsMap"),
  { ssr: false },
);

function contactParts(contactPublic: string) {
  const [phone, email] = contactPublic.split("\n").map((part) => part.trim());
  return { phone, email };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-semibold tracking-wide text-navy uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-navy">{value}</dd>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-card border border-card-border bg-off-white p-4">
      <h3 className="text-sm font-semibold tracking-wide text-navy uppercase">
        {label}
      </h3>
      <p className="mt-1 text-navy">{value}</p>
    </section>
  );
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
  const hasDistance = Boolean(location && origin && destination);
  const distanceLabel = hasDistance
    ? `${calculateDistanceInMiles(origin as number[], destination as number[]).toFixed(1)} miles away`
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
        className="flex h-dvh w-full max-w-3xl flex-col bg-white md:h-[min(90dvh,880px)] md:rounded-card"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <header className="sticky top-0 z-10 shrink-0 bg-navy px-4 py-4 text-white md:px-8">
          <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2">
            <span aria-hidden />
            <h2
              id={titleId}
              className="text-center text-xl font-extrabold md:text-2xl"
            >
              {event.eventName}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-11 cursor-pointer items-center justify-center justify-self-end rounded-full text-white hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <p className="text-center text-sm font-semibold tracking-wide text-sage uppercase">
            Hosted by {event.organisation}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span
              className={
                free
                  ? "rounded-pill bg-free-fill px-3 py-1 text-sm font-semibold text-free-text"
                  : "rounded-pill bg-paid-fill px-3 py-1 text-sm font-semibold text-amber-dark"
              }
            >
              {free ? "Free" : "Paid"}
            </span>
            {accessible ? (
              <span className="rounded-pill bg-access-fill px-3 py-1 text-sm font-semibold text-access-text">
                Accessible
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
            <div>
              <div className="flex gap-2 text-navy">
                <MapPin className="mt-1 shrink-0 text-sage" aria-hidden />
                <div>
                  <h3 className="font-semibold">{event.venueName}</h3>
                  <p>
                    {event.address}, {event.city}, {event.postcode}
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                <Fact
                  label="Date"
                  value={
                    event.isChristmasDay === "Yes"
                      ? "Christmas Day, 25 December"
                      : event.lastUpdated
                  }
                />
                <Fact label="Time" value={event.time} />
                <Fact label="Event type" value={event.eventType} />
                <Fact
                  label={hasDistance ? "Distance" : "Postcode"}
                  value={distanceLabel}
                />
              </dl>
            </div>

            <div className="overflow-hidden rounded-card">
              <EventsMap
                events={[event]}
                location={location}
                postcodeCoords={postcodeCoords}
                position={event.coordinates.latLng}
                zoom={16}
                isForModal
                height="180px"
              />
            </div>
          </div>

          <section className="mt-6">
            <h3 className="text-sm font-semibold tracking-wide text-navy uppercase">
              About this event
            </h3>
            <p className="mt-1 text-navy">{event.description}</p>
          </section>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <DetailCard label="Accessibility" value={event.accessibility} />
            <DetailCard label="Cost" value={event.cost} />
            <DetailCard label="Booking" value={event.bookingRequired} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-pill border border-sage font-semibold text-navy hover:border-navy hover:bg-hover-tint"
              >
                <Phone size={18} aria-hidden />
                {phone}
              </a>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-pill border border-sage font-semibold text-navy hover:border-navy hover:bg-hover-tint"
              >
                <Mail size={18} aria-hidden />
                Email
              </a>
            ) : null}
          </div>

          <p className="mt-4 mb-2 text-center text-sm text-mid-grey">
            You will be contacting {event.organisation} directly.
          </p>
        </div>
      </div>
    </div>
  );
}