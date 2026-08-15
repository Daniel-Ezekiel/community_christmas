import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Community Christmas | Find an event near you",
  description:
    "Find a community Christmas event near you. Search by postcode to find local Christmas Day meals, activities, and welcoming spaces across the UK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-off-white text-ink font-sans"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
