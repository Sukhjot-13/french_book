"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type PeekEntityType =
  | "verb"
  | "tense"
  | "expression"
  | "grammar"
  | "vocab"
  | "chapter"
  | "trap"
  | "example"
  | "exercise"
  | "concept";

export interface PeekData {
  type: PeekEntityType;
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  facts: { label: string; value: string }[];
  description?: string;
  patternSnippet?: string;
  constructions?: { text: string; subtext?: string; url?: string }[];
  examples?: { french: string; english: string }[];
  traps?: { title: string; correct?: string; incorrect?: string }[];
  chapters?: number[];
}

interface PeekHistoryItem {
  type: PeekEntityType;
  id: string;
}

interface PeekContextType {
  isOpen: boolean;
  isLoading: boolean;
  peekData: PeekData | null;
  openPeek: (type: PeekEntityType, id: string, pushHistory?: boolean) => void;
  closePeek: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

const PeekContext = createContext<PeekContextType | undefined>(undefined);

export function PeekProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [peekData, setPeekData] = useState<PeekData | null>(null);

  // In-memory cache for instant zero-latency repeat peeks
  const cacheRef = useRef<Map<string, PeekData>>(new Map());

  // History stack for back/forward navigation inside the Peek Drawer
  const [history, setHistory] = useState<PeekHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const fetchPeekData = useCallback(async (type: PeekEntityType, id: string): Promise<PeekData | null> => {
    const cacheKey = `${type}:${id}`;
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)!;
    }

    try {
      const res = await fetch(`/api/peek?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data: PeekData = await res.json();
        cacheRef.current.set(cacheKey, data);
        return data;
      } else {
        console.error("Failed to fetch peek data", await res.text());
        return null;
      }
    } catch (err) {
      console.error("Error fetching peek:", err);
      return null;
    }
  }, []);

  const openPeek = useCallback(
    async (type: PeekEntityType, id: string, pushHistory: boolean = true) => {
      setIsOpen(true);

      if (pushHistory) {
        setHistory((prev) => {
          const nextHistory = prev.slice(0, historyIndex + 1);
          return [...nextHistory, { type, id }];
        });
        setHistoryIndex((prev) => prev + 1);
      }

      const cacheKey = `${type}:${id}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setPeekData(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await fetchPeekData(type, id);
      if (data) {
        setPeekData(data);
      }
      setIsLoading(false);
    },
    [fetchPeekData, historyIndex]
  );

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex >= 0 && historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const item = history[newIndex];
    if (item) {
      openPeek(item.type, item.id, false);
    }
  }, [canGoBack, history, historyIndex, openPeek]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const item = history[newIndex];
    if (item) {
      openPeek(item.type, item.id, false);
    }
  }, [canGoForward, history, historyIndex, openPeek]);

  const closePeek = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <PeekContext.Provider
      value={{
        isOpen,
        isLoading,
        peekData,
        openPeek,
        closePeek,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
      }}
    >
      {children}
    </PeekContext.Provider>
  );
}

export function usePeek() {
  const ctx = useContext(PeekContext);
  if (!ctx) {
    throw new Error("usePeek must be used within a PeekProvider");
  }
  return ctx;
}
