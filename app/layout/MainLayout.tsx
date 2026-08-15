import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Header />
        <main className="px-4 py-6 md:px-8">
            {children}
        </main>
        <Footer />
    </>
  )
}