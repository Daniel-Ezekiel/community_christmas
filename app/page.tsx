import { Suspense } from "react";
import MainLayout from "./layout/MainLayout";
import Events from "./_components/homepage/Events";
import StatusPanel from "./_components/homepage/StatusPanel";

export default function Home() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <StatusPanel
            variant="loading"
            title="Looking for events near you..."
            description="This may take a moment."
          />
        }
      >
        <Events />
      </Suspense>
    </MainLayout>
  );
}
