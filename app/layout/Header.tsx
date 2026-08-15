import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8 md:py-5">
        <Link href="/" className="w-20 shrink-0 md:w-24 lg:w-28">
          <Image
            src={MarmaladeLogo}
            alt="Marmalade Trust"
            className="h-auto w-full"
          />
        </Link>
        <a
          href="https://www.marmaladetrust.org/community-christmas"
          className="py-2 text-base font-medium text-white hover:underline"
        >
          About Community Christmas
        </a>
      </nav>

      <div className="mx-auto max-w-xl px-4 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7">
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
