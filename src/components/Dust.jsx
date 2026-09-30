// Slow-floating specks of dust, like a listening room in the afternoon light.
// Pauses when the tab is hidden, and stays still for people who prefer less motion.
import React, { useEffect, useRef } from "react";
import { useLightScheme, useReducedMotion } from "../hooks";

const TAU = Math.PI * 2;

const Dust = () => {
  const ref = useRef(null);
  const light = useLightScheme();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext?.("2d");
    if (!ctx) return undefined;
    let specks = [];
    let frame = 0;
    const color = light ? "#7a6a58" : "#fff4e0";

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const count = Math.round(Math.min(60, (w * h) / 26000));
        specks = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.8,
          vx: 0.05 + Math.random() * 0.12,
          vy: -0.04 - Math.random() * 0.1,
          p: Math.random() * TAU,
        }));
      }
      return { w, h, dpr };
    };

    const draw = (move) => {
      const { w, h, dpr } = fit();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const s of specks) {
        if (move) {
          s.x += s.vx;
          s.y += s.vy;
          s.p += 0.015;
          if (s.x > w + 5) s.x = -5;
          if (s.y < -5) s.y = h + 5;
        }
        ctx.globalAlpha = 0.22 + 0.33 * (0.5 + 0.5 * Math.sin(s.p));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fill();
      }
    };

    const loop = () => {
      draw(true);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (reduced) draw(false);
      else if (!document.hidden) loop();
    };
    const onResize = () => draw(false);

    start();
    document.addEventListener("visibilitychange", start);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("resize", onResize);
    };
  }, [light, reduced]);

  return <canvas ref={ref} className="dust" />;
};

export default Dust;
