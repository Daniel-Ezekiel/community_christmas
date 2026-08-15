// Global ambient types — no import needed, available across the whole app.
// Mirrors the shaped event object returned by the Google Sheet route handler
// (see app/api/route.ts) and, eventually, the HubSpot API response.

import { LatLngExpression } from "leaflet";

export interface EventDetails {
  id: string;
  eventName: string;
  organisation: string;
  venueName: string;
  postcode: string;
  coordinates: {
    isTerminated: boolean,
    latLng: LatLngExpression,
  }
  city: string;
  address: string;
  eventType: string;
  description: string;
  isChristmasDay: "Yes" | "No";
  time: string;
  openToAll: "Yes" | "No";
  bookingRequired: string;
  cost: string;
  accessibility: string;
  spacesStatus: string;
  contactPublic: string;
  mapDescription: string;
  lastUpdated: string;
}

export interface EventsApiResponse {
  success: boolean;
  count: number;
  events: EventDetails[];
}

export interface ApiErrorResponse {
  error: string;
}
