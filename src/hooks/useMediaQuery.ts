"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query and re-renders on change.
 * Implemented with useSyncExternalStore so the server snapshot and the first
 * client render agree (false) and the real value arrives without a
 * setState-in-effect cascade.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
      const list = window.matchMedia(query);
      if (typeof list.addEventListener === "function") {
        list.addEventListener("change", onStoreChange);
        return () => list.removeEventListener("change", onStoreChange);
      }
      list.addListener(onStoreChange);
      return () => list.removeListener(onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}

export const MEDIA_BREAKPOINTS = {
  desktop: "(min-width: 768px)",
  tablet: "(min-width: 1024px)",
  wide: "(min-width: 1280px)",
} as const;
