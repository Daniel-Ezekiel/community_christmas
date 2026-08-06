import Image from "next/image";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import ChristmasIllustration from "@/app/assets/images/christmas-baubles-illustration.png";
import Button from "../_components/Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-3 pt-0 pb-8 bg-navy text-white overflow-hidden md:py-8">
      <nav className="relative">
        <div className="grid grid-cols-[auto_auto] gap-4 md:grid-cols-[1fr_2fr_1fr] md:gap-8">
          <Link
            href="/"
            className="w-28 h-28 sm:object-cover md:self-center md:justify-self-end md:w-32 md:h-32 lg:w-36 lg:h-36"
          >
            <Image src={MarmaladeLogo} alt="Marmalade Trust Logo" />
          </Link>

          <div className="row-start-2 col-span-full md:py-5 md:row-start-1 md:col-start-2 md:col-span-1 md:self-center md:z-1 lg:py-10">
            <h1 className="text-2xl font-extrabold lg:text-4xl lg:text-center xl:text-5xl">
              Community Christmas
            </h1>
            <p className="mt-2 lg:text-xl xl:text-2xl lg:text-center">
              No one should have to spend Christmas Day alone. Find a warm
              welcome near you.
            </p>

            <form
              action="/"
              method="GET"
              className="mt-4 sm:grid sm:grid-cols-[2fr_1fr] sm:gap-4 sm:items-center"
            >
              <div className="form_control mb-4 bg-white rounded-lg flex items-center justify-between px-4 py-2 sm:mb-0">
                <label htmlFor="search" id="search-label" className="hidden">
                  Enter postcode or town
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter postcode or town"
                  className="bg-transparent text-navy placeholder:text-mid-grey focus:ring-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey"
                />
                <select
                  name="distance"
                  id="distance"
                  className="bg-amber rounded-3xl text-amber-dark font-semibold text-xs border border-sage focus:ring-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey"
                >
                  <option value="5">Within 5 miles</option>
                  <option value="10">Within 10 miles</option>
                  <option value="15">Within 15 miles</option>
                  <option value="20">Within 20 miles</option>
                  <option value="25">Within 25 miles</option>
                </select>
              </div>
              <Button variant="default" type="submit">
                Search
              </Button>
            </form>
          </div>

          <Image
            src={ChristmasIllustration}
            alt="Christmas Illustration"
            className="max-h-24 object-contain justify-self-end md:absolute md:-top-10 md:-right-10 lg:max-h-32"
          />
        </div>
      </nav>
    </header>
  );
}
