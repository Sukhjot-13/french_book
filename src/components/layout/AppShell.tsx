"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "../search/CommandPalette";
import { PeekProvider } from "../peek/PeekContext";
import { PeekDrawer } from "../peek/PeekDrawer";
import { GlobalKeyboardShortcuts } from "../common/GlobalKeyboardShortcuts";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen for global custom event to open command palette from anywhere
  React.useEffect(() => {
    const handleOpenPalette = () => setIsCommandPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpenPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenPalette);
  }, []);

  // Close mobile drawer upon navigating
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Revision Home", href: "/", icon: "home", count: null },
    { label: "Chapters", href: "/chapters", icon: "import_contacts", count: "27" },
    { label: "Verbs Library", href: "/verbs", icon: "translate", count: "496" },
    { label: "Tenses & Moods", href: "/tenses", icon: "history_toggle_off", count: "24" },
    { label: "Grammar Rules", href: "/grammar", icon: "menu_book", count: "284" },
    { label: "Expressions", href: "/expressions", icon: "chat_bubble", count: "557" },
    { label: "Vocabulary", href: "/vocabulary", icon: "dictionary", count: "1,002" },
    { label: "Concepts", href: "/concepts", icon: "psychology", count: "206" },
    { label: "Exercises", href: "/exercises", icon: "quiz", count: "217" },
    { label: "Traps & Pitfalls", href: "/traps", icon: "warning", count: "108" },
    { label: "Example Explorer", href: "/examples", icon: "format_quote", count: "1,011" },
  ];

  return (
    <PeekProvider>
      <div className="min-h-screen flex bg-surface text-on-surface antialiased">
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside className="w-[280px] bg-surface-container-low border-r border-outline-variant/60 hidden lg:flex flex-col justify-between sticky top-0 h-screen py-6 px-4 z-30 select-none overflow-y-auto">
          <div className="flex flex-col gap-5">
            {/* Brand Header */}
            <Link href="/" className="flex items-center gap-3 px-2 group">
              <div className="w-10 h-10 rounded bg-[#002147] text-white flex items-center justify-center font-serif text-xl font-bold tracking-tighter shadow-sm group-hover:bg-primary transition-colors">
                L'É
              </div>
              <div>
                <h1 className="font-sans text-base font-bold text-primary tracking-tight leading-none">
                  L'Étude
                </h1>
                <p className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mt-1">
                  French Master Revision
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
                    className={`flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white font-semibold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? "text-white fill-icon" : "text-secondary"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white font-bold"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Metadata */}
          <div className="border-t border-outline-variant/60 pt-4 px-2 space-y-2 mt-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
              <span>Edition: Master Schema</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant/80 font-sans leading-tight">
              Comprehensive French Grammar revision platform with full master schema data.
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-lg hover:bg-surface-container-high active:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Search repository"
              title="Search repository (⌘K)"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-surface-container-high active:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER OVERLAY */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 top-14 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="bg-surface-container-low border-b border-outline-variant/70 p-4 shadow-xl flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant px-3 py-1">
                Navigation Libraries
              </span>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white font-semibold shadow-xs"
                        : "text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? "text-white fill-icon" : "text-secondary"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white font-bold"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
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

        {/* Universal Level 2 Peek Drawer */}
        <PeekDrawer />

        {/* Global Keyboard Shortcuts (Cmd+K, /, Esc, j, k, o, Enter) */}
        <GlobalKeyboardShortcuts />
      </div>
    </PeekProvider>
  );
}
