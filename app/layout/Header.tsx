import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 md:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src={MarmaladeLogo}
            alt="Marmalade Trust"
            className="h-16 w-auto md:h-20"
          />
        </Link>
        <a
          href="https://www.marmaladetrust.org/community-christmas"
          className="text-base font-medium text-white hover:underline"
        >
          About Community Christmas
        </a>
      </nav>

      <div className="mx-auto max-w-xl px-4 pt-1 pb-5 md:px-8 md:pt-2 md:pb-6">
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
