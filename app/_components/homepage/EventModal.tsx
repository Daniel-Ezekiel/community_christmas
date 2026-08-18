"use client";

import { useEffect, useId, useRef } from "react";
import dynamic from "next/dynamic";
import { Open_Sans } from "next/font/google";
import {
  Accessibility,
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  Phone,
  Tag,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EventDetails } from "@/types";
import { LatLngExpression } from "leaflet";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import { isAccessibleEvent, isFreeEvent } from "@/app/_utils/eventFilters";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

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
      <dt className="text-[12px] text-[#6b7280]">{label}</dt>
      <dd className="mt-1 text-[16px] font-semibold text-[#1a2e3b]">{value}</dd>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon: Icon,
  tinted = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tinted?: boolean;
}) {
  return (
    <section
      className={
        tinted
          ? "rounded-card border border-card-border bg-[#e8f5e9] p-4"
          : "rounded-card border border-card-border bg-off-white p-4"
      }
    >
      <h3 className="flex items-center gap-2 text-[12px] font-normal text-[#6b7280]">
        <Icon size={16} aria-hidden />
        {label}
      </h3>
      <p className="mt-1 text-[16px] font-semibold text-[#1a2e3b]">{value}</p>
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
  const hasDescription = Boolean(event.description?.trim());
  const bookingNotRequired =
    !/book/i.test(event.bookingRequired) ||
    /no booking/i.test(event.bookingRequired);
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
    : "";

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
        className={`${openSans.className} flex h-auto max-h-dvh w-full max-w-3xl flex-col overflow-y-auto bg-white text-[#1a2e3b] md:max-h-[min(90dvh,880px)] md:rounded-card`}
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

        <div className="px-4 py-6 md:px-8">
          <p className="text-center text-sm font-semibold text-[#395460]">
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
              <div className="grid grid-cols-[1.25rem_1fr] items-start gap-x-2 gap-y-3 text-[#1a2e3b]">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-sage"
                  aria-hidden
                />
                <div>
                  <h3 className="font-semibold text-[#1a2e3b]">
                    {event.venueName}
                  </h3>
                  <p className="text-[#1a2e3b]">
                    {event.address}, {event.city}, {event.postcode}
                  </p>
                </div>
                <Clock
                  size={20}
                  className="self-center shrink-0"
                  aria-hidden
                />
                <span className="self-center">{event.time}</span>
              </div>

              {hasDistance ? (
                <dl className="mt-3">
                  <Fact label="Distance" value={distanceLabel} />
                </dl>
              ) : null}
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

          {hasDescription ? (
            <section className="mt-2">
              <h3 className="text-[12px] font-normal text-[#6b7280]">
                About this event
              </h3>
              <p className="mt-1 text-[#1a2e3b]">{event.description}</p>
            </section>
          ) : null}

          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <DetailCard
              label="Accessibility"
              value={event.accessibility}
              icon={Accessibility}
              tinted={accessible}
            />
            <DetailCard
              label="Cost"
              value={event.cost}
              icon={Tag}
              tinted={free}
            />
            <DetailCard
              label="Booking"
              value={event.bookingRequired}
              icon={CalendarCheck}
              tinted={bookingNotRequired}
            />
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

          <p className="mt-4 mb-2 text-center text-sm text-[#6b7280]">
            You will be contacting {event.organisation} directly.
          </p>
        </div>
      </div>
    </div>
  );
}