import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

const logoSrc =
  typeof MarmaladeLogo === "string" ? MarmaladeLogo : MarmaladeLogo.src;

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 md:px-8">
        <Link href="/" className="block h-[88px] shrink-0 md:h-[110px]">
          <Image
            src={logoSrc}
            alt="Marmalade Trust"
            width={184}
            height={180}
            priority
            className="h-full w-auto max-w-none"
            style={{ width: "auto", height: "100%" }}
          />
        </Link>
        <a
          href="https://www.marmaladetrust.org/community-christmas"
          className="text-base font-medium text-white hover:underline"
        >
          About Community Christmas
        </a>
      </nav>

      <div className="mx-auto max-w-xl px-4 pt-0 pb-5 md:px-8 md:pb-6">
        <h1 className="text-center text-2xl font-extrabold md:text-3xl">
          Community Christmas
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-base font-normal md:text-lg">
          No one should have to spend Christmas Day alone. Find a warm welcome
          near you.
        </p>
        <Suspense
          fallback={
            <div className="mx-auto mt-3 h-12 rounded-full bg-white/15" />
          }
        >
          <SearchForm />
        </Suspense>
      </div>
    </header>
  );
}
