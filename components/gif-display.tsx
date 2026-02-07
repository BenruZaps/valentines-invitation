"use client";

import { useMemo } from "react";

/**
 * ============================================================
 * GIF DISPLAY COMPONENT
 * ============================================================
 * Each stage has an ARRAY of GIFs — one is picked at random
 * each time the stage changes. Add as many as you like!
 *
 * Stages:
 *   - initial:   The first romantic ask
 *   - surprised:  "Are you sure?" — shocked reaction
 *   - playful:  After 1-2 "No" clicks — teasing
 *   - sad:      After 3-4 "No" clicks — dramatic sadness
 *   - begging:  After 5-6 "No" clicks — full beg mode
 *   - sike:     The fake give-up psych-out
 *   - success:  When they finally say YES!
 * ============================================================
 */

const GIF_URLS: Record<string, string[]> = {
  // ---- ADD MORE GIFs TO EACH ARRAY FOR VARIETY ----
  initial: [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzl3ZXFxbmc4c2o1YjBuN21ienp6ZWN3Yjd4MnVhOTR0NzRxOTgxayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Gut8LeP5yefbSdpIOr/giphy.gif",
    // Add more initial GIFs here:
    // "https://media.giphy.com/media/.../giphy.gif",
  ],
  surprised: [
    // Add your "Are you sure?!" reaction GIFs here:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDI3M2JteDI2b2VqNnFnYnJ4NWo4NmI4czRzbHpvdGVxcXJpbnRwZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mIsbanQHRgRniYCIO3/giphy.gif"
  ],
  playful: [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjdtdTV1ZXEwZGM2ZDZqZ3c2cnhlZzgxdHNucnI0YzFvMHU0dnBoMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dCwNmR9BBOzKpiBQOs/giphy.gif"
    // Add more playful GIFs here:
    // "https://media.giphy.com/media/.../giphy.gif",
  ],
  sad: [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGg2cHU2Z21kN3N3ZXkyZXNsMm1mOHlubXV2MTBiYXlkZTdqamxleCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d2lcHJTG5Tscg/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTh0amdmODV6dTBnbHFsbW5qNGQ5am13Z284ZTI2bm1qanM5b3RpYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fhLgA6nJec3Cw/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNzN2p4OHljZnU5MmVseGt4eXV2OXRjbDkzNGZyOXJydjh3ZGI0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1BXa2alBjrCXC/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm14ejRndDZ3dThiMTl5NzhlOGgxMHc4bHltdW13azZrNTFvZXQ5ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/W0c3xcZ3F1d0EYYb0f/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aWJxbjhtZGlsOWI3czZqbHFiYWN5bW92bHpjMmJjcml0bnAxMGNrZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4zUmRD2x9vl06ltMXd/giphy.gif"
    // Add more sad GIFs here:
    // "https://media.giphy.com/media/.../giphy.gif",
  ],
  begging: [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2FhNjA4aDY1b2EwcjFjaWw1cWdxMHFubWkyNWp3NXl6aDFrMmNhbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zEtQ9FrbqIt3BVKY3i/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG5nZ24ybTU2Y3RsbmV2ZzRibGRreHlteDN6YTRrdTZxbmc0YjF6biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/O5oRZiBtdSqS3K7YnE/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2FhNjA4aDY1b2EwcjFjaWw1cWdxMHFubWkyNWp3NXl6aDFrMmNhbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/e1Tf1eOo6976zuGv3C/giphy.gif", 
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2FhNjA4aDY1b2EwcjFjaWw1cWdxMHFubWkyNWp3NXl6aDFrMmNhbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/e1Tf1eOo6976zuGv3C/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3czIwOWo4Z3RubjNzNW9hdmVtNzF4bDl5cXNnY3g5a3o3dnJvaDMwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9KI8vyCCAOqHbcMYd2/giphy.gif"

  ],
  sike: [
    // Add your "SIKE!! You thought?!" reaction GIFs here:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDFuM28zbGI5Z2s3OHRqbW1mN3Z6MzhteGFkOXNidHAwcG1qM2RjMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/c3JcoDpcAprRIyxHe4/giphy.gif",
  ],
  success: [
    
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGcyc3hlbXBsemFvMHNtZjZmcGZwbG1uZzc5ZGdpMHhxeHF5MjI4YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6CdI7BikMdZT2jRLF7/giphy.gif", 
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGcyc3hlbXBsemFvMHNtZjZmcGZwbG1uZzc5ZGdpMHhxeHF5MjI4YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QuBC2EJT0zOrZyjJjc/giphy.gif"
    // Add more success GIFs here:
    // "https://media.giphy.com/media/.../giphy.gif",
  ],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GifDisplayProps {
  stage: keyof typeof GIF_URLS;
  slide?: number;
}

export function GifDisplay({ stage, slide = 0 }: GifDisplayProps) {
  const url = useMemo(() => {
    const gifs = GIF_URLS[stage] || GIF_URLS.initial;
    return pickRandom(gifs);
  }, [stage, slide]);

  return (
    <div className="relative mx-auto mb-6 flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl border-4 border-primary/20 bg-white shadow-lg md:h-56 md:w-56">
      {/* Soft inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url || "/placeholder.svg"}
        alt={`Reaction: ${stage}`}
        className="relative z-10 h-full w-full object-cover"
      />
    </div>
  );
}
