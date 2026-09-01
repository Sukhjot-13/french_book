"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "../search/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Revision Home", href: "/", icon: "home" },
    { label: "Chapters", href: "/chapters", icon: "import_contacts" },
    { label: "Verbs Library", href: "/verbs", icon: "translate" },
    { label: "Tenses & Moods", href: "/tenses", icon: "history_toggle_off" },
    { label: "Grammar Rules", href: "/grammar", icon: "menu_book" },
    { label: "Expressions", href: "/expressions", icon: "chat_bubble" },
    { label: "Vocabulary", href: "/vocabulary", icon: "dictionary" },
    { label: "Example Explorer", href: "/examples", icon: "format_quote" },
  ];

  return (
    <div className="min-h-screen flex bg-surface text-on-surface antialiased">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-[270px] bg-surface-container-low border-r border-outline-variant/60 hidden lg:flex flex-col justify-between sticky top-0 h-screen py-6 px-4 z-30 select-none">
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-3 px-2 group">
            <div className="w-10 h-10 rounded bg-primary-container text-white flex items-center justify-center font-serif text-xl font-bold tracking-tighter shadow-sm group-hover:bg-primary transition-colors">
              L'É
            </div>
            <div>
              <h1 className="font-sans text-base font-bold text-primary tracking-tight leading-none">
                L'Étude
              </h1>
              <p className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mt-1">
                French Revision Portal
              </p>
            </div>
          </Link>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center justify-between w-full px-3 py-2 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 text-on-surface-variant transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Search repository...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface rounded border border-outline-variant/60">
              ⌘K
            </kbd>
          </button>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant px-3 mb-1">
              Academic Libraries
            </span>
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? "text-white fill-icon" : "text-secondary"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Metadata */}
        <div className="border-t border-outline-variant/60 pt-4 px-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
            <span>Edition: PMP 4th Ed.</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant/80 font-sans leading-tight">
            Academic graph revision dataset with bidirectional cross-linking.
          </p>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface-container-low border-b border-outline-variant/60 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-serif font-bold text-sm">
            L'É
          </div>
          <span className="font-bold text-sm text-primary">L'Étude</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-14 z-30 bg-surface-container-low/95 backdrop-blur-md p-4 flex flex-col gap-2 overflow-y-auto"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded text-base font-medium ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pt-0 pt-14">
        {/* Top Desktop Bar with Breadcrumb / Action */}
        <header className="hidden lg:flex items-center justify-between h-14 px-8 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">
              L'Étude
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold capitalize">
              {pathname === "/" ? "Revision Portal" : pathname.split("/")[1]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-xs text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Quick Search</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 bg-surface rounded">⌘K</kbd>
            </button>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 max-w-[1360px] w-full mx-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
