"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";
import SearchForm from "../_components/SearchForm";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      setPastThreshold(y > 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCompact = pastThreshold && !pinnedOpen;

  return (
    <header
      ref={headerRef}
      className={
        isCompact
          ? scrolled
            ? "site-header is-scrolled is-compact bg-navy text-white"
            : "site-header is-compact bg-navy text-white"
          : scrolled
            ? "site-header is-scrolled bg-navy text-white"
            : "site-header bg-navy text-white"
      }
      onFocusCapture={() => setPinnedOpen(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!headerRef.current?.contains(next)) {
          setPinnedOpen(false);
        }
      }}
    >
      <div className="site-header-inner mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col items-center md:grid md:grid-cols-[8rem_1fr_8rem] md:items-center md:gap-6 lg:grid-cols-[9rem_1fr_9rem]">
          <div className="site-header-brand w-28 shrink-0 md:w-32 lg:w-36">
            <div className="min-h-0 overflow-hidden">
              <Link href="/" className="block">
                <Image
                  src={MarmaladeLogo}
                  alt="Marmalade Trust"
                  className="h-auto w-full"
                />
              </Link>
            </div>
          </div>

          <div className="site-header-main mt-4 w-full max-w-xl md:mt-0 md:justify-self-center">
            <div className="site-header-intro">
              <div className="min-h-0 overflow-hidden">
                <h1 className="text-center text-2xl font-extrabold md:text-3xl lg:text-4xl">
                  Community Christmas
                </h1>
                <p className="mx-auto mt-2 max-w-xl text-center text-base font-normal md:text-lg">
                  No one should have to spend Christmas Day alone. Find a warm
                  welcome near you.
                </p>
              </div>
            </div>
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
