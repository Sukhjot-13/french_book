"use client";

import React from "react";
import { usePeek, PeekData } from "./PeekContext";

interface PeekTriggerProps {
  type: PeekData["type"];
  id: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "button" | "badge" | "icon" | "inline";
  title?: string;
}

export function PeekTrigger({
  type,
  id,
  children,
  className = "",
  variant = "inline",
  title = "Quick Peek",
}: PeekTriggerProps) {
  const { openPeek } = usePeek();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPeek(type, id);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        className={`p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors inline-flex items-center justify-center ${className}`}
      >
        <span className="material-symbols-outlined text-[15px]">visibility</span>
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/40 transition-colors cursor-pointer ${className}`}
      >
        <span>{children || id}</span>
        <span className="material-symbols-outlined text-[12px] opacity-60">visibility</span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-primary transition-colors cursor-pointer ${className}`}
      >
        <span>{children || "Peek"}</span>
        <span className="material-symbols-outlined text-[14px]">visibility</span>
      </button>
    );
  }

  return (
    <span
      onClick={handleClick}
      title={title}
      className={`cursor-pointer hover:underline text-primary inline-flex items-center gap-0.5 ${className}`}
    >
      {children || id}
      <span className="material-symbols-outlined text-[12px] opacity-60 hover:opacity-100">
        visibility
      </span>
    </span>
  );
}
