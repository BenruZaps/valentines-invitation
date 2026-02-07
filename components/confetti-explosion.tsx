"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  shape: "heart" | "circle" | "star";
}

const COLORS = [
  "hsl(346, 77%, 50%)",
  "hsl(330, 70%, 60%)",
  "hsl(350, 80%, 70%)",
  "hsl(0, 70%, 65%)",
  "hsl(340, 60%, 55%)",
];

const SHAPES = {
  heart: "\u2665",
  circle: "\u25CF",
  star: "\u2605",
};

export function ConfettiExplosion() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 0.5,
      shape: (["heart", "circle", "star"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }));
    setParticles(generated);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {SHAPES[p.shape]}
        </span>
      ))}
    </div>
  );
}
