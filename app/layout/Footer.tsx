import Image from "next/image";
import Link from "next/link";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center md:px-8">
        <Image
          src={MarmaladeLogo}
          alt="Marmalade Trust"
          className="mx-auto h-auto w-28 md:w-32"
        />

        <nav
          aria-label="Footer"
          className="mt-6 text-sm font-medium text-white/70"
        >
          <Link href="#" className="hover:text-white">
            About Marmalade Trust
          </Link>
          <span aria-hidden className="px-2">
            ·
          </span>
          <Link href="#" className="hover:text-white">
            Contact
          </Link>
          <span aria-hidden className="px-2">
            ·
          </span>
          <Link href="#" className="hover:text-white">
            Cookie Policy
          </Link>
        </nav>

        <p className="mx-auto mt-6 text-sm font-medium text-white/70 md:text-base">
          Community Christmas events are run by independent organisations and
          venues. Marmalade Trust links and promotes them, but does not run the
          events. Please contact the organiser directly to attend.
        </p>

        <p className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Marmalade Trust. Registered charity number 1174217.
        </p>
      </div>
    </footer>
  );
}
