"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchResultItem } from "@/src/lib/data/search";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via document event or props
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search API fetch on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=15`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Navigation within modal via arrows and enter
  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    router.push(item.url);
    onClose();
  };

  if (!isOpen) return null;

  const typeIcons: Record<string, string> = {
    verb: "translate",
    expression: "chat_bubble",
    vocabulary: "dictionary",
    grammar_rule: "menu_book",
    tense: "history_toggle_off",
    chapter: "import_contacts",
    example: "format_quote",
    exercise: "quiz",
    trap: "warning",
    concept: "psychology",
  };

  const typeLabels: Record<string, string> = {
    verb: "Verb",
    expression: "Expression",
    vocabulary: "Vocabulary",
    grammar_rule: "Grammar Rule",
    tense: "Tense / Mood",
    chapter: "Chapter",
    example: "Example",
    exercise: "Exercise",
    trap: "Pitfall",
    concept: "Concept",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline-variant/60 bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px] mr-3">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Search verbs, grammar rules, expressions, vocabulary, tenses..."
            className="flex-1 bg-transparent border-none outline-none text-base text-on-surface placeholder:text-on-surface-variant font-sans"
          />
          {isLoading && (
            <span className="text-xs font-mono text-on-surface-variant mr-2">Searching...</span>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-medium text-on-surface-variant bg-surface-container-high rounded border border-outline-variant">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 flex-1 divide-y divide-surface-container">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const icon = typeIcons[item.type] || "search";
              const typeLabel = typeLabels[item.type] || item.type;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary-container text-white"
                      : "hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSelected ? "text-primary-fixed-dim" : "text-secondary"
                      }`}
                    >
                      {icon}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p
                          className={`text-xs truncate ${
                            isSelected ? "text-white/80" : "text-on-surface-variant"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3">
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? "text-primary-fixed" : "text-on-surface-variant"
                      }`}
                    >
                      {typeLabel}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-white">
                        keyboard_return
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : query.trim() && !isLoading ? (
            <div className="p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-on-surface-variant/80">
                Search is accent-insensitive (e.g. typing &quot;etre&quot; finds &quot;être&quot;).
              </p>
            </div>
          ) : (
            <div className="p-6 text-xs text-on-surface-variant space-y-3">
              <p className="font-semibold uppercase tracking-wider text-[11px] text-primary">
                Quick Jump & Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    router.push("/verbs");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-surface-container text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">translate</span>
                  <span>Verbs Library</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/grammar");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-surface-container text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
                  <span>Grammar Rules</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/expressions");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-surface-container text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">chat_bubble</span>
                  <span>Expressions & Collocations</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/tenses");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-surface-container text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">history_toggle_off</span>
                  <span>Tenses & Moods</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-surface-container-high border-t border-outline-variant/60 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
          <div className="flex items-center gap-2">
            <span>Navigate: ↑ ↓</span>
            <span>•</span>
            <span>Select: Enter</span>
          </div>
          <span>Accent-insensitive search</span>
        </div>
      </div>
    </div>
  );
}
