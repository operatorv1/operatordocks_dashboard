import { useEffect } from "react";

/**
 * Sets document title and scrolls to top on mount.
 * Call at the very top of every page component.
 */
export function usePageMeta(title: string) {
  useEffect(() => {
    document.title = `${title} · OperatorDocks`;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title]);
}
