"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePeek } from "./PeekContext";

export function PeekDrawer() {
  const { isOpen, isLoading, peekData, closePeek, openPeek } = usePeek();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closePeek();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePeek]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={closePeek}
        aria-label="Close preview"
      />

      {/* Slide-over panel (Right desktop, bottom-sheet style on small screens) */}
      <aside
        className="relative z-10 w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#002147] text-white">
              {peekData?.type || "Quick Peek"}
            </span>
            <span className="text-xs font-mono text-on-surface-variant">Level 2 Preview</span>
          </div>
          <button
            onClick={closePeek}
            className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-on-surface">
          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-8 bg-surface-container-high rounded animate-pulse w-3/4" />
              <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/2" />
              <div className="grid grid-cols-2 gap-2 pt-4">
                <div className="h-14 bg-surface-container-high rounded animate-pulse" />
                <div className="h-14 bg-surface-container-high rounded animate-pulse" />
              </div>
              <div className="h-20 bg-surface-container-high rounded animate-pulse" />
            </div>
          ) : peekData ? (
            <>
              {/* Title and English Gloss */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-sans text-primary tracking-tight">
                  {peekData.title}
                </h2>
                {peekData.subtitle && (
                  <p className="text-base font-serif italic text-secondary">
                    {peekData.subtitle}
                  </p>
                )}
                {peekData.description && (
                  <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                    {peekData.description}
                  </p>
                )}
              </div>

              {/* Pattern / Formation snippet if any */}
              {peekData.patternSnippet && (
                <div className="p-3 rounded-lg bg-[#002147] text-white font-mono text-xs border border-blue-900 shadow-xs">
                  <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold mb-0.5">
                    Pattern / Formation:
                  </span>
                  <div className="text-blue-100 font-semibold">{peekData.patternSnippet}</div>
                </div>
              )}

              {/* Essential Facts Badges / Strip */}
              {peekData.facts && peekData.facts.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {peekData.facts.map((f, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-surface-container-low border border-outline-variant/40"
                    >
                      <span className="text-[10px] uppercase text-on-surface-variant block">
                        {f.label}
                      </span>
                      <span className="font-bold text-primary truncate block">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Traps / Pitfalls alert if any */}
              {peekData.traps && peekData.traps.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-1 font-bold text-amber-900">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>Common Pitfall</span>
                  </div>
                  {peekData.traps.map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="font-medium text-amber-900">{t.title}</div>
                      {(t.correct || t.incorrect) && (
                        <div className="grid grid-cols-2 gap-1 font-mono text-[11px] pt-1">
                          {t.correct && (
                            <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                              ✓ {t.correct}
                            </span>
                          )}
                          {t.incorrect && (
                            <span className="text-rose-800 bg-rose-100/80 px-1.5 py-0.5 rounded line-through">
                              ✗ {t.incorrect}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Common Constructions / Collocations */}
              {peekData.constructions && peekData.constructions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                  <span className="text-xs font-mono font-bold uppercase text-on-surface-variant block">
                    Common Constructions
                  </span>
                  <div className="space-y-1.5">
                    {peekData.constructions.map((c, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-surface-container-lowest border border-outline-variant/50 text-xs flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-semibold text-primary">{c.text}</span>
                          {c.subtext && (
                            <span className="text-on-surface-variant block text-[11px]">
                              {c.subtext}
                            </span>
                          )}
                        </div>
                        {c.url && (
                          <button
                            onClick={() => openPeek("expression", c.text)}
                            className="text-[11px] font-mono text-primary group-hover:underline flex items-center gap-0.5"
                          >
                            <span>Peek</span>
                            <span className="material-symbols-outlined text-[12px]">visibility</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples in Context */}
              {peekData.examples && peekData.examples.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                  <span className="text-xs font-mono font-bold uppercase text-on-surface-variant block">
                    Example Sentences
                  </span>
                  <div className="space-y-2">
                    {peekData.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-surface-container-low border border-outline-variant/40 text-xs space-y-0.5"
                      >
                        <p className="font-serif text-primary text-sm font-medium">
                          {ex.french}
                        </p>
                        <p className="text-on-surface-variant text-[11px]">
                          {ex.english}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter reference */}
              {peekData.chapters && peekData.chapters.length > 0 && (
                <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                  <span>Found in:</span>
                  {peekData.chapters.slice(0, 4).map((ch) => (
                    <Link
                      key={ch}
                      href={`/chapters/${ch}`}
                      onClick={closePeek}
                      className="px-1.5 py-0.5 rounded bg-surface-container hover:bg-primary hover:text-white transition-colors"
                    >
                      Ch {ch}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-on-surface-variant text-xs">
              No preview details available.
            </div>
          )}
        </div>

        {/* Drawer Footer with Deep Dive Link */}
        {peekData && (
          <div className="p-4 border-t border-outline-variant/60 bg-surface-container-low flex items-center justify-between">
            <button
              onClick={closePeek}
              className="px-3 py-1.5 rounded text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Close
            </button>
            <Link
              href={peekData.url}
              onClick={closePeek}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#002147] hover:bg-primary text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Open Full {peekData.type.charAt(0).toUpperCase() + peekData.type.slice(1)}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
