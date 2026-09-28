import React from "react";

/**
 * Shared skeleton for the list routes. Rendered by app/<route>/loading.tsx while
 * a server component awaits the dataset filter pass.
 */
export function ListSkeleton({ rows = 8, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div className="space-y-4 pb-12" aria-busy="true" aria-live="polite">
      <div className="border-b border-outline-variant/60 pb-3 space-y-2">
        <div className="h-6 w-64 rounded bg-surface-container-high animate-pulse" />
        <div className="h-3 w-full max-w-xl rounded bg-surface-container-high animate-pulse" />
      </div>
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 w-16 rounded bg-surface-container-high animate-pulse" />
        ))}
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant/30 overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-3.5 flex items-center gap-4">
            <div className="h-4 w-1/3 rounded bg-surface-container-high animate-pulse" />
            <div className="h-3 w-12 rounded bg-surface-container-high animate-pulse" />
            <div className="h-3 flex-1 rounded bg-surface-container-high animate-pulse" />
            <div className="h-4 w-16 rounded bg-surface-container-high animate-pulse" />
          </div>
        ))}
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
}
