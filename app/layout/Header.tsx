import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import ChristmasIllustration from "@/app/assets/images/christmas-baubles-illustration.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="overflow-hidden bg-navy px-4 pb-8 pt-3 text-white md:px-8 md:py-8">
      <nav className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-[auto_auto] items-start gap-4 md:grid-cols-[auto_1fr_auto] md:gap-8">
          <Link
            href="/"
            className="relative z-10 w-20 sm:w-28 md:w-32 lg:w-36"
          >
            <Image src={MarmaladeLogo} alt="Marmalade Trust" />
          </Link>

          <div className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1 md:self-center">
            <h1 className="text-2xl font-extrabold lg:text-center lg:text-4xl xl:text-5xl">
              Community Christmas
            </h1>
            <p className="mt-2 text-base lg:text-center lg:text-xl">
              No one should have to spend Christmas Day alone. Find a warm
              welcome, a meal or a bit of company near you.
            </p>
            <Suspense
              fallback={
                <div className="mt-4 h-12 rounded-input bg-white/20" />
              }
            >
              <SearchForm />
            </Suspense>
          </div>

          <Image
            src={ChristmasIllustration}
            alt=""
            className="max-h-20 justify-self-end object-contain md:absolute md:-right-6 md:-top-8 md:max-h-32"
          />
        </div>
      </nav>
    </header>
  );
}