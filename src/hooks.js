import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { paletteFrom, sampleImage } from "./lib/color";
import { coverSrc } from "./lib/entries";

function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (!window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(subscribe, () => Boolean(window.matchMedia?.(query).matches), () => false);
}

export const useLightScheme = () => useMediaQuery("(prefers-color-scheme: light)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

// The current "#2024" or "#2024/edit" in the address bar
function parseHash(hash) {
  const m = /^#(\d{4})(\/edit)?$/.exec(hash || "");
  return m ? { year: Number(m[1]), edit: Boolean(m[2]) } : { year: null, edit: hash === "#edit" };
}
export function useRoute() {
  const hash = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("hashchange", onChange);
      return () => window.removeEventListener("hashchange", onChange);
    },
    () => window.location.hash,
    () => ""
  );
  const go = useCallback((year, edit) => {
    window.location.hash = `${year}${edit ? "/edit" : ""}`;
  }, []);
  return [parseHash(hash), go];
}

// Loads every album cover once and returns a function giving each year's palette
export function useCoverPalettes(entries) {
  const [samples, setSamples] = useState({});
  const requested = useRef(new Set());
  const srcs = entries.flatMap((e) => (e.albums || []).map((a) => coverSrc(a.cover)).filter(Boolean));
  const key = srcs.join("|");

  useEffect(() => {
    for (const src of key ? key.split("|") : []) {
      if (requested.current.has(src)) continue;
      requested.current.add(src);
      const img = new Image();
      img.onload = () => {
        let px = [];
        try {
          px = sampleImage(img);
        } catch {
          px = [];
        }
        setSamples((prev) => ({ ...prev, [src]: px }));
      };
      img.src = src;
    }
  }, [key]);

  return useCallback(
    (entry) =>
      paletteFrom(
        (entry.albums || []).flatMap((a) => samples[coverSrc(a.cover)] || [])
      ),
    [samples]
  );
}
