import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import ChristmasIllustration from "@/app/assets/images/christmas-baubles-illustration.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="overflow-hidden bg-navy text-white">
      <nav className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">
        <div className="flex flex-col items-center md:grid md:grid-cols-[1fr_minmax(0,40rem)_1fr] md:items-start md:gap-8">
          <Link href="/" className="w-24 shrink-0 md:w-32 md:justify-self-end lg:w-36">
            <Image
              src={MarmaladeLogo}
              alt="Marmalade Trust"
              className="h-auto w-full"
            />
          </Link>

          <div className="mt-4 w-full md:mt-0 md:py-4">
            <h1 className="text-center text-2xl font-extrabold md:text-4xl lg:text-5xl">
              Community Christmas
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm font-normal md:mt-3 md:text-lg">
              No one should have to spend Christmas Day alone. Find a warm
              welcome near you.
            </p>
            <Suspense
              fallback={
                <div className="mx-auto mt-4 h-12 max-w-xl rounded-full bg-white/15" />
              }
            >
              <SearchForm />
            </Suspense>
          </div>

          <Image
            src={ChristmasIllustration}
            alt=""
            className="hidden w-44 justify-self-end object-contain object-top md:block md:-mt-8 lg:w-56"
          />
        </div>
      </nav>
    </header>
  );
}