import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col items-center md:grid md:grid-cols-[8rem_1fr_8rem] md:items-center md:gap-6 lg:grid-cols-[9rem_1fr_9rem]">
          <Link href="/" className="w-28 shrink-0 md:w-32 lg:w-36">
            <Image
              src={MarmaladeLogo}
              alt="Marmalade Trust"
              className="h-auto w-full"
            />
          </Link>

          <div className="mt-4 w-full max-w-xl md:mt-0 md:justify-self-center">
            <h1 className="text-center text-2xl font-extrabold md:text-3xl lg:text-4xl">
              Community Christmas
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-center text-base font-normal md:text-lg">
              No one should have to spend Christmas Day alone. Find a warm
              welcome near you.
            </p>
            <Suspense
              fallback={
                <div className="mx-auto mt-4 h-12 rounded-full bg-white/15" />
              }
            >
              <SearchForm />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
