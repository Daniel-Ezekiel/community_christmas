import { LatLngExpression } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import EventCard from "./EventCard";

export default function MapMarker({position, eventData}: {position: LatLngExpression; eventData: EventDetails}) {
  return (
    <Marker position={position}>
      <Popup>
        <EventCard event={eventData} />
      </Popup>
    </Marker>
  );
}
