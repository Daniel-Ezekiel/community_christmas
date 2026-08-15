import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-white/15 px-4 py-3 md:px-8">
        <Link href="/" className="w-24 shrink-0 md:w-28 lg:w-32">
          <Image
            src={MarmaladeLogo}
            alt="Marmalade Trust"
            className="h-auto w-full"
          />
        </Link>
        <a
          href="https://www.marmaladetrust.org/community-christmas"
          className="inline-flex min-h-11 items-center rounded-pill border border-white/35 px-4 text-sm font-semibold text-white hover:bg-white/10"
        >
          About Community Christmas
        </a>
      </nav>

      <div className="mx-auto max-w-xl px-4 pt-4 pb-6 md:px-8 md:pt-5 md:pb-7">
        <h1 className="text-center text-2xl font-extrabold md:text-3xl lg:text-4xl">
          Community Christmas
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-base font-normal md:text-lg">
          No one should have to spend Christmas Day alone. Find a warm welcome
          near you.
        </p>
        <Suspense
          fallback={
            <div className="mx-auto mt-4 h-12 rounded-full bg-white/15" />
          }
        >
          <SearchForm />
        </Suspense>
      </div>
    </header>
  );
}
