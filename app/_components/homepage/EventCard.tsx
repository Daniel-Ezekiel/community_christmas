import { calculateDistanceInMiles } from "@/app/_utils/calculateDistance";
import { EventDetails } from "@/types";
import { LatLngExpression } from "leaflet";

export default function EventCard({
  event,
  location,
  postcodeCoords,
  handleModalOpen,
}: {
  event: EventDetails;
  location: string | null;
  postcodeCoords?: LatLngExpression;
  handleModalOpen: (eventID: string) => void;
}) {
  const distanceInMiles =  location && calculateDistanceInMiles(postcodeCoords as number[], event.coordinates.latLng as number[]);

  return (
    <div
      aria-label="button"
      role="button"
      className="border border-card-border rounded-xl p-4 cursor-pointer"
      onClick={() => handleModalOpen(event.id)}
    >
      <div className="grid grid-cols-[1fr_auto] gap-8 mb-4">
        <h3 className="font-semibold text-navy md:min-h-14">
          {event.eventName}
        </h3>
        <span className="px-3 py-1 rounded-3xl bg-success-fill text-success-text font-semibold text-sm self-start">
          Free
        </span>
      </div>

      <div className="border-y border-card-border py-2 my-2 flex justify-between text-sm text-mid-grey">
        <span>🕐 {event.time}</span>
        <span>📍 {!location && event.postcode} {location && `${(distanceInMiles as number)?.toFixed(1)} miles`}</span>
        <span>♿</span>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center text-sm text-mid-grey">
        <span className="w-fit bg-off-white border border-card-border rounded-[4px] px-2 py-1">
          {event.eventType}
        </span>
        <span>{event.organisation}</span>
      </div>
    </div>
  );
}
