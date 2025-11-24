import { Suspense } from "react";
import AppRoot from "./AppRoot";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <AppRoot />
    </Suspense>
  );
}
