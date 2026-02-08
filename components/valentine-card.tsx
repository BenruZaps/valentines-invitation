"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GifDisplay } from "./gif-display";
import { ConfettiExplosion } from "./confetti-explosion";
import { RainEffect } from "./rain-effect";

/* ────────────────────────────────────────────────────────
   ESCALATION STAGES
   Each stage has a unique question, subtitle, No-button
   text, and a mapped GIF key.
──────────────────────────────────────────────────────── */
const STAGES = [
  {
    question: "Will you be my Valentine?",
    subtitle: "I have a very important question for you...",
    noText: "No",
    gif: "initial" as const,
  },
  {
    question: "Are you sure?",
    subtitle: "Think again... I made this just for you!",
    noText: "Really no?",
    gif: "surprised" as const,
  },
  {
    question: "Pretty please?",
    subtitle: "Come on, don't do this to me...",
    noText: "Still no...",
    gif: "playful" as const,
  },

  {
    question: "Not even a tiny bit curious?",
    subtitle: "I promise it’s worth one click.",
    noText: "Nah",
    gif: "playful" as const,
  },

  {
    question: "You're breaking my heart...",
    subtitle: "I'm literally going to cry right now",
    noText: "I'm sorry but no",
    gif: "sad" as const,
  },
  {
    question: "What if I buy you food?",
    subtitle: "Anything you want. Unlimited budget. Kinda.",
    noText: "Not even food...",
    gif: "sad" as const,
  },
  {
    question: "I'm on my knees!",
    subtitle: "Please... I brought flowers and everything!",
    noText: "Nope",
    gif: "sad" as const,
  },
  {
    question: "I just felt a tear roll down my cheek",
    subtitle: "Okay I lied but I'm about to!",
    noText: "Drama queen",
    gif: "sad" as const,
  },
  {
    question: "HELP ME… just say yes",
    subtitle: "I will do literally anything. Gusto mo mag tumbling pako?.",
    noText: "Hmm…",
    gif: "begging" as const,
  },

  {
    question: "Okay fine… I will buy you potato doll again",
    subtitle: "Or literally any other babies you want. Deal?",
    noText: "Hmm… still no",
    gif: "begging" as const,
  },

  {
    question: "I'm running out of reasons...",
    subtitle: "But NOT running out of love for you!",
    noText: "That was corny",
    gif: "begging" as const,
  },
  {
    question: "Even my phone is judging you right now",
    subtitle: "The battery is draining from the emotional damage",
    noText: "Lol no",
    gif: "begging" as const,
  },
  {
    question: "Okay, last chance...",
    subtitle: "The universe is watching. Don't disappoint it.",
    noText: "Fine... maybe",
    gif: "begging" as const,
  },
  {
    question: "Just say YES already!",
    subtitle: "You know you want to...",
    noText: "Okay fine... YES",
    gif: "begging" as const,
  },
];

// The stage index where the fake give-up triggers
const FAKE_GIVEUP_STAGE = 9;

export function ValentineCard() {
  const [envelopeState, setEnvelopeState] = useState<
    "closed" | "opening" | "exiting" | "done"
  >("closed");
  const [stage, setStage] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [fakeGiveUp, setFakeGiveUp] = useState<
    null | "giving-up" | "psych"
  >(null);
  const [fakeGiveUpDone, setFakeGiveUpDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Envelope open animation timeline
  const handleEnvelopeClick = useCallback(() => {
    if (envelopeState !== "closed") return;
    setEnvelopeState("opening");
    // After flap opens, start exit animation
    setTimeout(() => setEnvelopeState("exiting"), 900);
    // After exit animation, reveal the card
    setTimeout(() => setEnvelopeState("done"), 1600);
  }, [envelopeState]);

  const currentStage = STAGES[Math.min(stage, STAGES.length - 1)];
  // Yes button grows with each rejection (capped at 1.3x)
  const yesScale = Math.min(1.2, 1 + stage * 0.03);
  // No button shrinks as stages progress
  const noScale = Math.max(0.7, 1 - stage * 0.025);

  const handleYes = useCallback(() => {
    setAccepted(true);
  }, []);

  const handleNo = useCallback(() => {
    // On the last stage, the No button text becomes "Okay fine... YES"
    // so clicking it also accepts!
    if (stage >= STAGES.length - 1) {
      setAccepted(true);
      return;
    }

    // Trigger the fake give-up once at the right stage
    if (stage === FAKE_GIVEUP_STAGE && !fakeGiveUpDone) {
      setFakeGiveUp("giving-up");
      return;
    }

    const nextStage = stage + 1;
    setStage(nextStage);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Make the button dodge around on middle stages
    if (nextStage >= 2 && nextStage < 8) {
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const maxX = Math.min(rect.width * 0.3, 80);
        const maxY = Math.min(rect.height * 0.15, 30);
        setNoPosition({
          x: Math.random() * maxX * 2 - maxX,
          y: Math.random() * maxY * 2 - maxY,
        });
      }
    } else {
      setNoPosition(null);
    }
  }, [stage, fakeGiveUpDone]);

  // Fake give-up animation timeline
  useEffect(() => {
    if (fakeGiveUp === "giving-up") {
      const timer = setTimeout(() => setFakeGiveUp("psych"), 2000);
      return () => clearTimeout(timer);
    }
    if (fakeGiveUp === "psych") {
      const timer = setTimeout(() => {
        setFakeGiveUp(null);
        setFakeGiveUpDone(true);
        // Advance to next stage after the fake-out
        setStage((s) => s + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fakeGiveUp]);

  // Reset dodging when stage gets to the begging final stages
  useEffect(() => {
    if (stage >= 8) {
      setNoPosition(null);
    }
  }, [stage]);

  /* ─── SUCCESS STATE ─── */
  if (accepted) {
    return (
      <>
        <ConfettiExplosion />
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="card-glow" />
          <div className="card-gradient-border relative z-10 mx-auto w-full max-w-md animate-bounce-in rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
            <div className="mb-6 flex justify-center">
              <img
                src="/custom-success.jpg"
                alt="Success"
                className="h-48 w-auto rounded-2xl object-cover shadow-lg md:h-64"
              />
            </div>
            <h1 className="mb-3 animate-pulse-love font-serif font-bold text-4xl text-primary md:text-5xl">
              {"Yay... I LOVE YOU SO MUCH!!!"}
            </h1>
            <p className="mb-2 animate-fade-in-up text-lg text-card-foreground">
              {"I knew you'd say yes!"}
            </p>
            <p className="animate-pulse-love text-3xl">{"❤️ ❤️ ❤️"}</p>
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-secondary via-pink-100 to-secondary p-4">
              <p className="font-serif text-xl text-secondary-foreground">
                {"You + Me = Forever"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── FAKE GIVE-UP SCREEN ─── */
  if (fakeGiveUp === "giving-up") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="card-glow" />
        <div className="relative z-10 mx-auto w-full max-w-md animate-bounce-in rounded-3xl border-2 border-border bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
          <GifDisplay stage="sad" />
          <h1 className="mb-3 font-serif font-bold text-3xl text-muted-foreground md:text-4xl">
            {"Okay... I give up"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {"Sayang naman :(("}
          </p>
          <p className="mt-4 text-sm text-muted-foreground/60">
            {"🥹🥹🥹🥹🥹🥹"}
          </p>
        </div>
      </div>
    );
  }

  if (fakeGiveUp === "psych") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="card-glow" />
        <div className="card-gradient-border relative z-10 mx-auto w-full max-w-md animate-bounce-in rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
          <GifDisplay stage="sike" />
          <h1 className="mb-3 animate-wiggle font-serif font-bold text-3xl text-primary md:text-4xl">
            {"SIKE!! You thought?!"}
          </h1>
          <p className="text-lg text-card-foreground">
            {"You really think I'd give up that easily?"}
          </p>
          <p className="mt-4 animate-pulse-love text-2xl text-primary">
            {"NEVER."}
          </p>
        </div>
      </div>
    );
  }

  /* ─── ENVELOPE STATE ─── */
  if (envelopeState !== "done") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="card-glow" />

        <div
          className="relative z-10 flex flex-col items-center"
          style={{
            animation:
              envelopeState === "exiting"
                ? "envelopeExit 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                : undefined,
          }}
        >
          {/* Floating sparkles around envelope */}
          {envelopeState === "closed" && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`sparkle-${
                    // biome-ignore lint: index is fine here
                    i
                  }`}
                  className="pointer-events-none absolute text-primary/40"
                  style={{
                    top: `${15 + Math.sin(i * 1.2) * 35}%`,
                    left: `${10 + (i * 16)}%`,
                    fontSize: `${8 + (i % 3) * 4}px`,
                    animation: `envelopeSparkle ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                >
                  {"✦"}
                </div>
              ))}
            </>
          )}

          {/* Envelope */}
          <button
            type="button"
            onClick={handleEnvelopeClick}
            className={`envelope-container cursor-pointer border-none bg-transparent p-0 outline-none focus:outline-none ${
              envelopeState === "closed" ? "animate-envelope-float" : ""
            }`}
            aria-label="Open envelope"
          >
            <div className="envelope-body">
              {/* Card peek inside */}
              <div className="envelope-card-peek">
                <span className="font-serif text-lg text-primary/50">
                  {"💌"}
                </span>
              </div>

              {/* Bottom V flap */}
              <div className="envelope-bottom-flap" />

              {/* Top flap */}
              <div
                className={`envelope-flap ${
                  envelopeState === "opening" || envelopeState === "exiting"
                    ? "open"
                    : ""
                }`}
              >
                <span className="envelope-seal">{"❤️"}</span>
              </div>
            </div>
          </button>

          {/* Text below envelope */}
          <div className="mt-8 text-center">
            <p className="font-serif text-2xl text-primary md:text-3xl">
              {"You have a letter!"}
            </p>
            {envelopeState === "closed" && (
              <p className="mt-2 animate-tap-pulse text-sm text-muted-foreground">
                {"Tap to open"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─── MAIN CARD ─── */
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Rain effect during sad stages */}
      {stage >= 4 && (
        <>
          <RainEffect />
          {/* Overlay to fade out hearts underneath */}
          <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-slate-200/80 to-slate-300/60 z-0" />
        </>
      )}

      {/* Background glow */}
      <div className="card-glow" />

      <div
        ref={cardRef}
        className={`card-gradient-border relative z-10 mx-auto w-full max-w-md rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm transition-all duration-500 md:p-12 ${isShaking ? "animate-shake" : ""} ${stage === 0 ? "card-reveal" : ""}`}
      >
        {/* GIF Area */}
        <GifDisplay stage={currentStage.gif} slide={stage} />

        {/* Question */}
        <h1 className="mb-2 font-serif font-bold text-3xl text-primary md:text-4xl">
          {currentStage.question}
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-sm text-muted-foreground transition-all duration-300 md:text-base">
          {currentStage.subtitle}
        </p>

        {/* Buttons */}
        <div className="relative flex flex-col items-center gap-4">
          {/* YES Button — grows with each rejection, has heartbeat & glow */}
          <button
            onClick={handleYes}
            type="button"
            className="btn-glow animate-heartbeat rounded-full bg-gradient-to-r from-primary via-rose-500 to-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-95"
            style={{
              "--yes-scale": yesScale,
              transform: `scale(${yesScale})`,
              zIndex: 10,
            } as React.CSSProperties}
          >
            {stage >= STAGES.length - 1
              ? "YES! (It was always meant to be)"
              : "Yes!"}
            {" 🤍"}
          </button>

          {/* NO Button — shrinks as stages progress, dodges in middle stages */}
          <button
            onClick={handleNo}
            type="button"
            className={`rounded-full border border-border px-6 py-2 text-sm transition-all duration-300 active:scale-95 ${
              stage >= STAGES.length - 1
                ? "bg-gradient-to-r from-primary/90 to-rose-500/90 text-primary-foreground hover:from-primary hover:to-rose-500"
                : "bg-secondary/80 text-secondary-foreground hover:bg-secondary"
            }`}
            style={{
              transform: noPosition
                ? `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`
                : `scale(${noScale})`,
              opacity: Math.max(0.5, 1 - stage * 0.04),
              transition: "all 0.3s ease",
            }}
          >
            {currentStage.noText}
          </button>
        </div>

        {/* Stage indicator — cute heart dots */}
        {stage > 0 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {STAGES.map((_, i) => (
              <div
                key={`dot-${
                  // biome-ignore lint: index is fine here
                  i
                }`}
                className={`transition-all duration-300 ${
                  i <= stage
                    ? "text-primary"
                    : "text-border"
                }`}
                style={{ fontSize: i <= stage ? "8px" : "6px" }}
              >
                {"\u2665"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
