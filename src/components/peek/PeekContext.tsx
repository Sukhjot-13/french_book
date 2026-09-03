"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface PeekData {
  type: "verb" | "tense" | "expression" | "grammar" | "vocab" | "chapter";
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

interface PeekContextType {
  isOpen: boolean;
  isLoading: boolean;
  peekData: PeekData | null;
  openPeek: (type: PeekData["type"], id: string) => void;
  closePeek: () => void;
}

const PeekContext = createContext<PeekContextType | undefined>(undefined);

export function PeekProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [peekData, setPeekData] = useState<PeekData | null>(null);

  const openPeek = useCallback(async (type: PeekData["type"], id: string) => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/peek?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setPeekData(data);
      } else {
        console.error("Failed to fetch peek data", await res.text());
      }
    } catch (err) {
      console.error("Error opening peek:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closePeek = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <PeekContext.Provider value={{ isOpen, isLoading, peekData, openPeek, closePeek }}>
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
