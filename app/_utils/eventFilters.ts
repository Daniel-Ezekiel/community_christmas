import { EventDetails } from "@/types";

export const EVENT_FILTERS = [
  { id: "all", label: "All events" },
  { id: "free", label: "Free only" },
  { id: "accessible", label: "Accessible" },
  { id: "spaces", label: "Spaces left" },
  { id: "booking", label: "Booking required" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "activity", label: "Activity" },
] as const;

export type EventFilterId = (typeof EVENT_FILTERS)[number]["id"];
export type SelectableEventFilterId = Exclude<EventFilterId, "all">;

export const MORE_EVENT_FILTERS = EVENT_FILTERS.filter(
  (filter): filter is (typeof EVENT_FILTERS)[number] & {
    id: SelectableEventFilterId;
  } => filter.id !== "all",
);

const TYPE_FILTERS = new Set<SelectableEventFilterId>([
  "lunch",
  "dinner",
  "activity",
]);

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

export function filterEvents(
  events: EventDetails[],
  selected: readonly SelectableEventFilterId[],
) {
  if (selected.length === 0) return events;

  const types = selected.filter((id) => TYPE_FILTERS.has(id));
  const attributes = selected.filter((id) => !TYPE_FILTERS.has(id));

  return events.filter((event) => {
    if (types.length > 0) {
      const matchesType = types.some((type) =>
        event.eventType.toLowerCase().includes(type),
      );
      if (!matchesType) return false;
    }

    return attributes.every((attribute) => {
      switch (attribute) {
        case "free":
          return isFreeEvent(event);
        case "accessible":
          return isAccessibleEvent(event);
        case "spaces":
          return hasSpacesLeft(event);
        case "booking":
          return requiresBooking(event);
        default:
          return true;
      }
    });
  });
}