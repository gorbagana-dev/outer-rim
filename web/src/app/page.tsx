import { HomeView } from "@/components/layout/home-view";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center text-[var(--text-muted)]">
          Loading the landfill…
        </div>
      }
    >
      <HomeView />
    </Suspense>
  );
}
