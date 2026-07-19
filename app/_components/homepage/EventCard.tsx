export default function EventCard({event}: {event: EventDetails}) {
  return (
    <div className="border border-card-border rounded-xl p-4">
      <div className="grid grid-cols-[1fr_auto] gap-8 mb-4">
        <h3 className="font-semibold text-navy">{event.eventName}</h3>
        <span className="px-3 py-1 rounded-3xl bg-success-fill text-success-text font-semibold text-sm self-start">Free</span>
      </div>

      <div className="border-y border-card-border py-2 my-2 flex justify-between text-sm text-mid-grey">
        <span>🕐 {event.time}</span>
        <span>📍 {event.postcode} - 0.4 miles</span>
        <span>♿</span>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center text-sm text-mid-grey">
        <span className="w-fit bg-off-white border border-card-border rounded-[4px] px-2 py-1">{event.eventType}</span>
        <span>{event.organisation}</span>
      </div>
    </div>
  );
}
