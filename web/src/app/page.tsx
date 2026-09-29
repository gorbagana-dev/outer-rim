import { HomeView } from "@/components/layout/home-view";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] text-[var(--text-muted)]">
          Opening the chute…
        </div>
      }
    >
      <HomeView />
    </Suspense>
  );
}
