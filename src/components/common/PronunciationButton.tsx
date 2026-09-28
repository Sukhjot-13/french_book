"use client";

import React, { useState, useSyncExternalStore } from "react";

interface PronunciationButtonProps {
  text: string;
  lang?: string;
  label?: string;
}

const ICON = "volume_up";
const ICON_CLASS = "material-symbols-outlined text-[20px]";
const SPEAKING_ICON_CLASS = `${ICON_CLASS} animate-pulse text-primary`;

/**
 * Audio pronunciation via the Web Speech API (suggestion 2026-09-03).
 * No network, no assets: the browser synthesizes French speech locally.
 * The button is always rendered (server and client agree) so the markup never
 * differs between the two passes. Support is detected in a mount effect and
 * mirrored into a ref so the click handler is a safe no-op when unsupported.
 */
const subscribeToSpeechSupport = () => () => {};

function getSpeechSupportSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

function getSpeechSupportServerSnapshot(): boolean {
  return false;
}

export function PronunciationButton({ text, lang = "fr-FR", label }: PronunciationButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  // The server snapshot is false, so the server and the first client render emit
  // the same disabled button; the real capability lands on the next render.
  const supported = useSyncExternalStore(
    subscribeToSpeechSupport,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  );

  const accessibleLabel = label || `Hear pronunciation: ${text}`;

  const speak = () => {
    if (!getSpeechSupportSnapshot()) return;
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
      title={accessibleLabel}
      aria-label={accessibleLabel}
      aria-disabled={supported ? undefined : true}
      className={`inline-flex items-center justify-center p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${
        supported ? "" : "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-on-surface-variant"
      }`}
    >
      <span className={speaking ? SPEAKING_ICON_CLASS : ICON_CLASS}>{ICON}</span>
    </button>
  );
}
