"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePeek } from "../peek/PeekContext";

export function GlobalKeyboardShortcuts() {
  const router = useRouter();
  const { isOpen, peekData, closePeek } = usePeek();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused =
        activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      // 1. "/" or Cmd/Ctrl+K -> Open search or focus search
      if (!isInputFocused && ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
        return;
      }

      if (!isInputFocused && e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"][placeholder*="Search" i], input[type="text"][placeholder*="search" i]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }
        return;
      }

      // If typing in an input, don't trigger navigation keys
      if (isInputFocused) return;

      // 2. Escape key -> Close Peek Drawer
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closePeek();
        return;
      }

      // 3. 'o' key -> Open full page for the currently open peek
      if (e.key === "o" && isOpen && peekData?.url) {
        e.preventDefault();
        const dest = peekData.url;
        closePeek();
        router.push(dest);
        return;
      }

      // 4. 'j' / 'k' or ArrowDown / ArrowUp -> table row navigation
      if (e.key === "j" || e.key === "k" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        const rows = Array.from(
          document.querySelectorAll<HTMLTableRowElement>("tbody tr.cursor-pointer")
        );
        if (rows.length === 0) return;

        const currentIndex = rows.findIndex((r) => r.getAttribute("data-selected") === "true");
        let nextIndex = currentIndex;

        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          nextIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : rows.length - 1;
        }

        rows.forEach((r, idx) => {
          if (idx === nextIndex) {
            r.setAttribute("data-selected", "true");
            r.classList.add("bg-surface-container-high");
            r.scrollIntoView({ block: "nearest", behavior: "smooth" });
          } else {
            r.removeAttribute("data-selected");
            r.classList.remove("bg-surface-container-high");
          }
        });
        return;
      }

      // 5. Enter or Space -> Open peek for selected table row
      if (e.key === "Enter" || e.key === " ") {
        const selectedRow = document.querySelector<HTMLTableRowElement>(
          'tbody tr.cursor-pointer[data-selected="true"]'
        );
        if (selectedRow) {
          e.preventDefault();
          selectedRow.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, peekData, closePeek, router]);

  return null;
}
