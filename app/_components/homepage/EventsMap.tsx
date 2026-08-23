"use client";

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import {
  AttributionControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useRef } from "react";
import { EventDetails } from "@/types";
import EventCard from "./EventCard";

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

const christmasMarker = L.divIcon({
  className: "",
  html: `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="#E8A020"/>
      <circle cx="14" cy="14" r="6" fill="#fff" opacity="0.9"/>
    </svg>
  `,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

export default function EventsMap({
  position,
  zoom,
  events,
  location,
  postcodeCoords,
  handleModalOpen,
  isForModal = false,
  height = "475px",
}: {
  position: LatLngExpression;
  zoom?: number;
  events: EventDetails[];
  location: string | null;
  postcodeCoords?: LatLngExpression;
  handleModalOpen?: (eventID: string) => void;
  isForModal?: boolean;
  height?: string;
}) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative z-0 isolate overflow-hidden">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        className={isForModal ? undefined : "h-[200px] md:h-[360px]"}
        style={{ minHeight: isForModal ? height : undefined, width: "100%" }}
        attributionControl={false}
        ref={(map) => {
          if (map && mapRef.current && mapRef.current !== map) {
            mapRef.current.remove(); // strips the old instance's _leaflet_id stamp
          }
          mapRef.current = map;
        }}
      >
        <AttributionControl position="bottomright" prefix="" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((eventData) => (
          <Marker
            key={eventData.id}
            position={eventData.coordinates.latLng}
            icon={christmasMarker}
          >
            {!isForModal && (
              <Popup
                className="event-map-popup"
                minWidth={320}
                maxWidth={320}
                closeButton
              >
                <EventCard
                  event={eventData}
                  location={location}
                  postcodeCoords={postcodeCoords}
                  handleModalOpen={(id) => handleModalOpen?.(id)}
                  className="rounded-none border-0 border-l-0 hover:bg-hover-tint [&>div:first-child]:pr-6"
                />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
