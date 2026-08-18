import Link from "next/link";

export default function EmptyState({
  location,
  distance,
}: {
  location: string;
  distance: string | null;
}) {
  const widerSearchHref = `/?location=${encodeURIComponent(location)}&distance=25`;

  return (
    <div className="min-h-80 my-10 col-span-full grid gap-4 place-items-center text-center md:max-w-xl md:mx-auto md:px-20 md:py-10 md:bg-white md:border md:border-card-border md:rounded-card">
      <div
        aria-hidden
        className="mx-auto w-16 h-16 bg-light-sage rounded-full grid place-items-center"
      >
        <div className="h-5 w-5 bg-navy rounded-full" />
      </div>
      <p className="text-lg font-semibold text-navy md:text-xl lg:text-2xl">
        {distance
          ? `0 events within ${distance} miles of ${location}`
          : `0 events near ${location}`}
      </p>
      <p className="text-base text-mid-grey md:text-lg">
        Events are added all the way up to Christmas, so it&apos;s worth
        checking back. In the meantime, try a wider search.
      </p>
      {distance !== "25" ? (
        <Link
          href={widerSearchHref}
          className="inline-flex min-h-11 w-fit items-center rounded-pill bg-navy px-10 font-semibold text-white hover:bg-sage"
        >
          Search within 25 miles
        </Link>
      ) : null}
      <Link href="/" className="text-navy underline">
        or browse every event across the UK as a list
      </Link>
    </div>
  );
}