import { Accessibility, Clock, MapPin } from "lucide-react";
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

  return (
    <button
      type="button"
      onClick={() => handleModalOpen(event.id)}
      className={cn(
        "w-full rounded-card border border-card-border bg-white p-4 text-left cursor-pointer hover:bg-hover-tint",
        className,
      )}
    >
      <div className="mb-3 grid grid-cols-[1fr_auto] items-start gap-3">
        <h3 className="font-semibold text-navy">{event.eventName}</h3>
        <span
          className={
            free
              ? "rounded-pill bg-free-fill px-2 py-0.5 text-xs font-semibold text-free-text md:px-3 md:py-1 md:text-sm"
              : "rounded-pill bg-paid-fill px-2 py-0.5 text-xs font-semibold text-amber-dark md:px-3 md:py-1 md:text-sm"
          }
        >
          {free ? "Free" : "Paid"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-card-border py-2 text-sm text-mid-grey">
        <span className="inline-flex items-center gap-1">
          <Clock size={16} aria-hidden />
          {event.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={16} aria-hidden />
          {distanceInMiles != null
            ? `${distanceInMiles.toFixed(1)} miles away`
            : event.postcode}
        </span>
        {accessible ? (
          <span className="inline-flex items-center text-access-text">
            <Accessibility size={16} aria-label="Accessible venue" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="max-w-[50%] truncate rounded-tag border border-card-border bg-off-white px-2 py-1 text-navy">
          {event.eventType}
        </span>
        <span className="min-w-0 truncate text-mid-grey">{event.venueName}</span>
      </div>
    </button>
  );
}