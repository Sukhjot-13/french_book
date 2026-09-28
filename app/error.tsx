"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-5">
      <span className="material-symbols-outlined text-6xl text-rose-500">error</span>
      <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">Something went wrong</h1>
      <p className="text-sm text-on-surface-variant">
        The dataset could not be read while rendering this view. You can retry, or head back to a
        library that is known to be healthy.
      </p>
      {error.digest && (
        <p className="text-[11px] font-mono text-on-surface-variant/70">Reference: {error.digest}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded border border-outline-variant text-xs font-mono text-primary hover:bg-surface-container transition-colors"
        >
          ← Revision Home
        </Link>
      </div>
    </div>
  );
}
