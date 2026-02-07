"use client";

import { useEffect, useState } from "react";

interface RainDrop {
  id: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  isSadEmoji: boolean;
}

export function RainEffect() {
  const [drops, setDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    const generated: RainDrop[] = Array.from({ length: 80 }, (_, i) => {
      const isSadEmoji = Math.random() > 0.75;
      return {
        id: i,
        left: Math.random() * 100,
        // Sad emojis fall slower (3-5s) than rain (1-2.5s)
        duration: isSadEmoji
          ? Math.random() * 2 + 3
          : Math.random() * 1.5 + 1,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.4 + 0.5,
        isSadEmoji,
      };
    });
    setDrops(generated);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {drops.map((drop) =>
        drop.isSadEmoji ? (
          <div
            key={drop.id}
            className="absolute text-2xl"
            style={{
              left: `${drop.left}%`,
              top: "-50px",
              animationName: "rainFall",
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
              opacity: drop.opacity,
            }}
          >
            {["😢", "😭", "🥺", "😔"][Math.floor(Math.random() * 4)]}
          </div>
        ) : (
          <div
            key={drop.id}
            className="absolute h-16 w-0.5 bg-gradient-to-b from-slate-500/0 via-slate-600/90 to-slate-700"
            style={{
              left: `${drop.left}%`,
              top: "-50px",
              animationName: "rainFall",
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
              opacity: drop.opacity,
            }}
          />
        )
      )}
    </div>
  );
}
