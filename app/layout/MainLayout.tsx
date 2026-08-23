import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 flex-col px-4 py-6 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}