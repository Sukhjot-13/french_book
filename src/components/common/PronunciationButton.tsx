"use client";

import React, { useState } from "react";

interface PronunciationButtonProps {
  text: string;
  lang?: string;
  label?: string;
}

/**
 * Audio pronunciation via the Web Speech API (suggestion 2026-09-03).
 * No network, no assets: the browser synthesizes French speech locally.
 * Renders nothing when speech synthesis is unavailable.
 */
export function PronunciationButton({ text, lang = "fr-FR", label }: PronunciationButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const speak = () => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={speak}
      title={label || `Hear pronunciation: ${text}`}
      aria-label={label || `Hear pronunciation: ${text}`}
      className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
    >
      <span className={`material-symbols-outlined text-[20px]${speaking ? " animate-pulse text-primary" : ""}`}>
        {speaking ? "volume_up" : "volume_up"}
      </span>
    </button>
  );
}
