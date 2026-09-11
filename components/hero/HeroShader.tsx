"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PARTICLE_COUNT = 60;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return [217, 164, 65];
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function HeroShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId: number | null = null;
    let running = false;
    let color: [number, number, number] = [217, 164, 65];

    const readAccentColor = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-accent")
        .trim();
      if (raw) color = hexToRgb(raw);
    };
    readAccentColor();

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 1.5 + 0.5,
    }));

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const [r, g, b] = color;

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      if (!reduceMotion) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      readAccentColor();
      if (reduceMotion) {
        draw();
      } else {
        rafId = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const accentObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "data-accent")) {
        readAccentColor();
        if (reduceMotion && running) draw();
      }
    });
    accentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-accent"],
    });

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer.disconnect();
      accentObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
