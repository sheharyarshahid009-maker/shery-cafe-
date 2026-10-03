"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Gift, RotateCw, Ticket } from "lucide-react";

const PRIZES = [
  { label: "5% Off", color: "#f59e0b", code: "SPIN5" },
  { label: "Free Coffee", color: "#8b5cf6", code: "SPINCOFFEE" },
  { label: "10% Off", color: "#ec4899", code: "SPIN10" },
  { label: "Try Again", color: "#6b7280", code: "" },
  { label: "15% Off", color: "#10b981", code: "SPIN15" },
  { label: "Free Dessert", color: "#3b82f6", code: "SPINDESSERT" },
  { label: "20% Off", color: "#f43f5e", code: "SPIN20" },
  { label: "Try Again", color: "#6b7280", code: "" },
];

export default function SpinPage() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState<(typeof PRIZES)[number] | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(1);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    setWon(null);
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const newRotation = rotation + 1800 + (targetAngle - (rotation % 360) + 360) % 360;
    setRotation(newRotation);
    setSpinsLeft(spinsLeft - 1);
    setTimeout(() => {
      setSpinning(false);
      setWon(prize);
    }, 4000);
  };

  const segmentAngle = 360 / PRIZES.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Daily Fun</p>
      <h1 className="section-title mt-1 text-center">Spin & Win 🎡</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Roz ek free spin! Discounts aur free items jeeto!
      </p>
      <div className="relative mx-auto mt-10 h-72 w-72 sm:h-80 sm:w-80">
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-gold-400" />
        </div>
        <div
          ref={wheelRef}
          className="relative h-full w-full rounded-full border-4 border-gold-500/50 shadow-2xl transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((p, i) => {
            const angle = i * segmentAngle;
            return (
              <div key={i} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                <div
                  className="absolute left-1/2 top-0 h-1/2 w-full origin-bottom"
                  style={{
                    backgroundColor: p.color,
                    clipPath: `polygon(50% 0%, ${50 + 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 100%, ${50 - 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 100%)`,
                    opacity: 0.85,
                  }}
                />
                <span className="absolute left-1/2 top-6 -translate-x-1/2 text-[10px] font-bold text-white">
                  {p.label}
                </span>
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-gold-500 bg-ink-950">
            <Gift className="h-6 w-6 text-gold-400" />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button onClick={spin} disabled={spinning || spinsLeft <= 0} className="btn-gold !px-8 !py-4 !text-base disabled:opacity-50">
          <RotateCw className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Ghoom raha hai..." : spinsLeft > 0 ? `Spin Karo (${spinsLeft} left)` : "Kal phir aana!"}
        </button>
      </div>
      {won && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass mx-auto mt-8 max-w-md p-6 text-center">
          {won.code ? (
            <>
              <Ticket className="mx-auto h-10 w-10 text-gold-400" />
              <h3 className="mt-2 text-xl font-bold text-zinc-50">Mubarak ho! 🎉</h3>
              <p className="mt-1 text-lg font-bold text-gold-400">{won.label}</p>
              <p className="mt-2 text-sm text-zinc-400">Apka coupon code:</p>
              <p className="mt-1 inline-block rounded-lg border border-dashed border-gold-500/50 bg-gold-500/10 px-4 py-2 font-mono text-lg font-bold text-gold-400">{won.code}</p>
              <p className="mt-2 text-xs text-zinc-500">Order karte waqt ye code dikhao!</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-zinc-100">Koi baat nahi! 😊</p>
              <p className="mt-1 text-sm text-zinc-400">Kal phir try karo!</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
