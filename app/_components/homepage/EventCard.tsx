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
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-semibold text-navy">
            {event.eventName}
          </h3>
          <div className="mt-1 grid grid-cols-[1rem_1fr] items-center gap-x-2 gap-y-1 text-sm">
            <MapPin
              size={16}
              className="justify-self-center text-navy"
              aria-hidden
            />
            <p className="min-w-0 truncate font-medium text-navy">
              {[event.venueName, event.city].filter(Boolean).join(", ")}
            </p>
            <Clock
              size={16}
              className="justify-self-center text-mid-grey"
              aria-hidden
            />
            <p className="text-mid-grey">{event.time}</p>
          </div>
        </div>
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

      {distanceInMiles != null || accessible ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-card-border py-2 text-sm text-mid-grey">
          {distanceInMiles != null ? (
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} aria-hidden />
              {distanceInMiles.toFixed(1)} miles away
            </span>
          ) : null}
          {accessible ? (
            <span className="inline-flex items-center text-access-text">
              <Accessibility size={16} aria-label="Accessible venue" />
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="max-w-[50%] truncate rounded-tag border border-card-border bg-off-white px-2 py-1 text-navy">
          {event.eventType}
        </span>
      </div>
    </button>
  );
}