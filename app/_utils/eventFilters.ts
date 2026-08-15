import { EventDetails } from "@/types";

export const EVENT_FILTERS = [
  { id: "all", label: "All events" },
  { id: "free", label: "Free only" },
  { id: "accessible", label: "Accessible" },
  { id: "spaces", label: "Spaces left" },
  { id: "booking", label: "Booking req." },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "activity", label: "Activity" },
] as const;

export type EventFilterId = (typeof EVENT_FILTERS)[number]["id"];

export function isFreeEvent(event: EventDetails) {
  return /free/i.test(event.cost);
}

export function isAccessibleEvent(event: EventDetails) {
  const value = event.accessibility?.trim() ?? "";
  if (!value) return false;
  return !/^(n\/?a|none|no)\b/i.test(value);
}

function hasSpacesLeft(event: EventDetails) {
  return /space/i.test(event.spacesStatus) && !/full|none/i.test(event.spacesStatus);
}

function requiresBooking(event: EventDetails) {
  return /book/i.test(event.bookingRequired) && !/no booking/i.test(event.bookingRequired);
}

export function filterEvents(events: EventDetails[], filter: EventFilterId) {
  switch (filter) {
    case "all":
      return events;
    case "free":
      return events.filter(isFreeEvent);
    case "accessible":
      return events.filter(isAccessibleEvent);
    case "spaces":
      return events.filter(hasSpacesLeft);
    case "booking":
      return events.filter(requiresBooking);
    case "lunch":
    case "dinner":
    case "activity":
      return events.filter((event) =>
        event.eventType.toLowerCase().includes(filter),
      );
  }
}