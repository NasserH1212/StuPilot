"use client";

import { useEffect } from "react";

import { RouteError } from "@/src/modules/foundation/presentation/route-state";

interface ErrorBoundaryProps {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

export default function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    // A provider-neutral observability adapter will replace this boundary hook later.
    void error;
  }, [error]);

  return <RouteError retry={retry} />;
}
