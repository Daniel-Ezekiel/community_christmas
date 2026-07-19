import { LatLngExpression } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import EventCard from "./EventCard";
import { useQuery } from "@tanstack/react-query";

const getPostcodeDetails = async (postcode: string) => {
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);

    if (!postcode) throw new Error("no postcode provided:");

    if (!res.ok)
      throw new Error("Error fetching postcode details", {
        cause: res.statusText,
      });

    const {status, result, error} = await res.json();

    if (status === 404) throw new Error(error);

    return [result.latitude, result.longitude];
  } catch (err) {
    console.log("Failed to fetch postcode details:", err);
  }
};

export default function MapMarker({
  eventData,
}: {
  eventData: EventDetails;
}) {
  const { isPending, error, data } = useQuery({
    queryKey: [`postcodeData-${eventData.id}`],
    queryFn: () => getPostcodeDetails(eventData.postcode),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const postcodeData: LatLngExpression | number[] = data || [];

  return (
    <Marker position={postcodeData as LatLngExpression}>
      <Popup>
        <EventCard event={eventData} />
      </Popup>
    </Marker>
  );
}
