"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  toggleItemSaved,
  toggleItemReviewed,
  subscribeReviewState,
  getReviewStateSnapshot,
} from "@/src/lib/data/reviewStore";

interface RowActionMenuProps {
  type: "verb" | "vocab" | "grammar" | "expression";
  id: string;
  fullUrl: string;
  label: string;
}

export function RowActionMenu({ type, id, fullUrl, label }: RowActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // The store is read once per menu in a mount effect, then kept in sync via the
  // subscription, so a 50-row table performs 50 reads instead of 50 x 2 x renders.
  useEffect(() => {
    const hydrate = () => {
      const snapshot = getReviewStateSnapshot();
      setSaved(snapshot.saved.has(`${type}:${id}`));
      setReviewed(snapshot.reviewed.has(`${type}:${id}`));
    };
    hydrate();
    return subscribeReviewState(hydrate);
  }, [type, id]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      {/* Quick Status Badges */}
      <div className="flex items-center gap-1 mr-1">
        {saved && (
          <span
            className="material-symbols-outlined text-[15px] text-amber-600 fill-icon"
            title="Saved for review"
          >
            bookmark
          </span>
        )}
        {reviewed && (
          <span
            className="material-symbols-outlined text-[15px] text-emerald-600 fill-icon"
            title="Reviewed"
          >
            check_circle
          </span>
        )}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors ${
          isOpen ? "bg-surface-container-high text-primary" : ""
        }`}
        aria-label={`Actions for ${label}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Actions: Save / Review / Deep dive"
      >
        <span className="material-symbols-outlined text-[18px]">more_vert</span>
      </button>

      {/* Action Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label={`Actions for ${label}`}
          className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-lg py-1 z-30 animate-in fade-in-50 zoom-in-95 duration-100 text-xs text-on-surface"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-outline-variant/40 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold truncate">
            {label}
          </div>

          {/* Toggle Save */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              toggleItemSaved(type, id);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                saved ? "text-amber-600 fill-icon" : "text-on-surface-variant"
              }`}
            >
              {saved ? "bookmark" : "bookmark_border"}
            </span>
            <span>{saved ? "Remove from review" : "Save for review"}</span>
          </button>

          {/* Toggle Reviewed */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              toggleItemReviewed(type, id);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                reviewed ? "text-emerald-600 fill-icon" : "text-on-surface-variant"
              }`}
            >
              {reviewed ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span>{reviewed ? "Mark unreviewed" : "Mark as reviewed"}</span>
          </button>

          {/* Deep dive link */}
          <Link
            href={fullUrl}
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-surface-container-low text-primary font-medium border-t border-outline-variant/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Full Detail Page</span>
          </Link>
        </div>
      )}
    </div>
  );
}
