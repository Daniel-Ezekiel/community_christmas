import { Accessibility, Clock } from "lucide-react";
import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import { cn } from "@/app/_utils/cn";
import { isAccessibleEvent, isFreeEvent } from "@/app/_utils/eventFilters";
import { EventDetails } from "@/types";
import { LatLngExpression } from "leaflet";

function asLatLng(value: LatLngExpression | undefined): number[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return [Number(value[0]), Number(value[1])];
  if (typeof value === "object" && "lat" in value) {
    return [value.lat, value.lng];
  }
  return null;
}

function EventTypeChip({
  eventType,
  compact = false,
}: {
  eventType: string;
  compact?: boolean;
}) {
  return (
    <span
      className={
        compact
          ? "inline-block w-auto max-w-full self-start truncate rounded-chip border border-[#e5e7eb] bg-[#f3f4f6] px-2.5 py-1 text-xs text-navy font-medium"
          : "inline-block max-w-[50%] truncate rounded-pill border border-[#e5e7eb] bg-off-white px-2.5 py-0.75 text-sm text-navy"
      }
    >
      {eventType}
    </span>
  );
}

function PriceBadge({ free }: { free: boolean }) {
  return (
    <span
      className={
        free
          ? "shrink-0 rounded-pill bg-free-fill px-2 py-0.5 text-sm font-semibold text-free-text md:px-3 md:py-1 md:text-sm"
          : "shrink-0 rounded-pill bg-paid-fill px-2 py-0.5 text-sm font-semibold text-amber-dark md:px-3 md:py-1 md:text-sm"
      }
    >
      {free ? "Free" : "Paid"}
    </span>
  );
}

export default function EventCard({
  event,
  location,
  postcodeCoords,
  handleModalOpen,
  className,
}: {
  event: EventDetails;
  location: string | null;
  postcodeCoords?: LatLngExpression;
  handleModalOpen: (eventID: string) => void;
  className?: string;
}) {
  const origin = asLatLng(postcodeCoords);
  const destination = asLatLng(event.coordinates.latLng);
  const distanceInMiles =
    location && origin && destination
      ? calculateDistanceInMiles(origin, destination)
      : null;
  const free = isFreeEvent(event);
  const accessible = isAccessibleEvent(event);
  const venueLabel = [event.venueName, event.city].filter(Boolean).join(", ");

  return (
    <button
      type="button"
      onClick={() => handleModalOpen(event.id)}
      className={cn(
        "event-card w-full cursor-pointer border border-card-border bg-white text-left hover:bg-hover-tint",
        "rounded-l-none rounded-r-card border-l-[3px] border-l-[#E8A020] px-4 py-[14px]",
        "md:flex md:h-full md:flex-col md:rounded-[10px] md:border md:border-[#e5e7eb] md:border-l md:border-l-[#e5e7eb] md:p-4 md:hover:bg-white",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 md:hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="event-card-title font-bold text-navy">
            {event.eventName}
          </h3>
          <p className="line-clamp-2 text-sm font-medium text-navy">
            {venueLabel}
          </p>
          <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-navy">
            <Clock size={16} className="shrink-0" aria-hidden />
            <span>{event.time}</span>
            {accessible ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden>·</span>
                <Accessibility
                  size={16}
                  className="text-access-text"
                  aria-label="Accessible venue"
                />
              </span>
            ) : null}
          </p>
          {distanceInMiles != null ? (
            <p className="text-sm text-navy font-medium">
              {distanceInMiles.toFixed(1)} miles away
            </p>
          ) : null}
          <EventTypeChip eventType={event.eventType} compact />
        </div>
        <PriceBadge free={free} />
      </div>

      <div className="hidden h-full min-h-0 flex-col md:flex">
        <div className="flex items-start justify-between gap-3">
          <h3 className="event-card-title min-w-0 font-bold leading-snug text-navy">
            {event.eventName}
          </h3>
          <PriceBadge free={free} />
        </div>
        <p className="mt-1.5 text-sm text-navy">{venueLabel}</p>
        <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-navy">
          <Clock size={14} className="shrink-0" aria-hidden />
          <span>{event.time}</span>
          {accessible ? (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>·</span>
              <Accessibility
                size={18}
                aria-label="Accessible venue"
              />
            </span>
          ) : null}
        </p>
        {distanceInMiles != null ? (
          <p className="mt-1.5 text-sm text-navy font-medium">
            {distanceInMiles.toFixed(1)} miles away
          </p>
        ) : null}
        <div className="mt-auto pt-3">
          <EventTypeChip eventType={event.eventType} />
        </div>
      </div>
    </button>
  );
}
