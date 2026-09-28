import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Page not found — L'Étude",
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-5">
      <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
      <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">Page not found</h1>
      <p className="text-sm text-on-surface-variant">
        That entry does not exist in the dataset. It may have been renamed, or the link may be
        mistyped.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-4 py-2 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
        >
          ← Revision Home
        </Link>
        <Link
          href="/vocabulary"
          className="px-4 py-2 rounded border border-outline-variant text-xs font-mono text-primary hover:bg-surface-container transition-colors"
        >
          Vocabulary Dictionary
        </Link>
        <Link
          href="/verbs"
          className="px-4 py-2 rounded border border-outline-variant text-xs font-mono text-primary hover:bg-surface-container transition-colors"
        >
          Verbs Library
        </Link>
        <Link
          href="/search"
          className="px-4 py-2 rounded border border-outline-variant text-xs font-mono text-primary hover:bg-surface-container transition-colors"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
