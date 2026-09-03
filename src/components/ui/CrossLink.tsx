import React from "react";
import Link from "next/link";

interface CrossLinkProps {
  type: "verb" | "expression" | "grammar" | "tense" | "chapter" | "vocab" | "concept";
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  className?: string;
}

export function CrossLink({ type, id, label, sublabel, badge, className = "" }: CrossLinkProps) {
  const routes: Record<CrossLinkProps["type"], string> = {
    verb: `/verbs/${encodeURIComponent(id)}`,
    expression: `/expressions/${encodeURIComponent(id)}`,
    grammar: `/grammar/${encodeURIComponent(id)}`,
    tense: `/tenses/${encodeURIComponent(id)}`,
    chapter: `/chapters/${encodeURIComponent(id)}`,
    vocab: `/vocabulary/${encodeURIComponent(id || label)}`,
    concept: `/concepts/${encodeURIComponent(id)}`,
  };

  const icons: Record<CrossLinkProps["type"], string> = {
    verb: "translate",
    expression: "chat_bubble",
    grammar: "menu_book",
    tense: "history_toggle_off",
    chapter: "import_contacts",
    vocab: "dictionary",
    concept: "psychology",
  };

  const href = routes[type] || "#";
  const icon = icons[type] || "arrow_forward";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-primary transition-all duration-150 group text-sm font-medium ${className}`}
    >
      <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {sublabel && <span className="text-xs text-on-surface-variant font-normal">({sublabel})</span>}
      {badge && (
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-primary/10 text-primary rounded ml-1">
          {badge}
        </span>
      )}
      <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-on-surface-variant">
        chevron_right
      </span>
    </Link>
  );
}
