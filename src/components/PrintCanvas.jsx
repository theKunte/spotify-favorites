// A square canvas that draws a soundprint, sharp on high-density screens.
// When `animateKey` changes, the rings draw in from the center.
// `maxSize` caps the pixel size, for very large, faint uses like the backdrop.
import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks";

const DURATION = 900;

const PrintCanvas = ({ render, animateKey = null, className, label, maxSize = Infinity }) => {
  const ref = useRef(null);
  const lastKey = useRef(animateKey);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext?.("2d");
    if (!ctx) return undefined;
    const fit = () => {
      const s = Math.max(1, Math.round(Math.min(maxSize, canvas.clientWidth * (window.devicePixelRatio || 1))));
      if (canvas.width !== s) canvas.width = canvas.height = s;
      return s;
    };
    const animate = lastKey.current !== animateKey && !reduced;
    lastKey.current = animateKey;

    let frame = 0;
    if (animate) {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / DURATION);
        render(ctx, fit(), 1 - (1 - p) ** 3);
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } else {
      render(ctx, fit(), 1);
    }

    let observer;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(() => {
        const before = canvas.width;
        if (fit() !== before) render(ctx, canvas.width, 1);
      });
      observer.observe(canvas);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [render, animateKey, reduced, maxSize]);

  return (
    <canvas
      ref={ref}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
};

export default PrintCanvas;
