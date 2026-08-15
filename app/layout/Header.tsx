import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import ChristmasIllustration from "@/app/assets/images/christmas-baubles-illustration.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="w-16 shrink-0 md:w-20">
          <Image
            src={MarmaladeLogo}
            alt="Marmalade Trust"
            className="h-auto w-full"
          />
        </Link>
        <a
          href="https://www.marmaladetrust.org/community-christmas"
          className="text-sm font-semibold text-white/90 hover:text-white hover:underline"
        >
          About Community Christmas
        </a>
      </nav>

      <div className="relative mx-auto max-w-xl px-4 pb-6 pt-2 md:px-8 md:pb-8">
        <Image
          src={ChristmasIllustration}
          alt=""
          className="pointer-events-none absolute -top-6 right-0 hidden w-36 opacity-25 md:block lg:w-44"
        />
        <h1 className="relative text-center text-2xl font-extrabold md:text-3xl lg:text-4xl">
          Community Christmas
        </h1>
        <p className="relative mx-auto mt-2 max-w-xl text-center text-base font-normal md:mt-3 md:text-lg">
          No one should have to spend Christmas Day alone. Find a warm welcome
          near you.
        </p>
        <Suspense
          fallback={
            <div className="relative mx-auto mt-4 h-12 rounded-full bg-white/15" />
          }
        >
          <SearchForm />
        </Suspense>
      </div>
    </header>
  );
}
