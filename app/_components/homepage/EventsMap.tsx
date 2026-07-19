"use client";

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { useRef } from "react";
import MapMarker from "./MapMarker";

// Importing the marker PNGs as JS modules (the usual community fix) crashes
// the renderer under this project's Next/Turbopack setup — Next's image-import
// loader turns them into {src, width, height} objects mid client-only bundle,
// which broke here. Serving them as plain static files from public/ instead
// avoids the asset-import pipeline entirely.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function EventsMap({
  position,
  zoom,
  events
}: {
  position: LatLngExpression;
  zoom?: number;
  events: EventDetails[]
}) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        ref={(map) => {
          if (map && mapRef.current && mapRef.current !== map) {
            mapRef.current.remove(); // strips the old instance's _leaflet_id stamp
          }
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          {
            events.map((eventData) => <MapMarker key={eventData.id} eventData={eventData} />)
          }
      </MapContainer>
    </div>
  );
}
