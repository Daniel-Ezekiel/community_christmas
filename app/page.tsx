import { Suspense } from "react";
import MainLayout from "./layout/MainLayout";
import Events from "./_components/homepage/Events";

export default function Home() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="max-w-fit mx-auto grid gap-4">
            <p className="text-center"> Loading...</p>
          </div>
        }
      >
        <Events />
      </Suspense>
    </MainLayout>
  );
}
