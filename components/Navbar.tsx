"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VolumeX, Volume2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Background music initialization
    const audio = new Audio("/audio/hero.mpeg");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked, waiting for interaction");
        });
        setIsPlaying(true);
        // Subtle volume ramp up
        let vol = 0;
        const interval = setInterval(() => {
          if (vol < 0.3) {
            vol += 0.02;
            if (audioRef.current) audioRef.current.volume = vol;
          } else {
            clearInterval(interval);
          }
        }, 150);
      }
      window.removeEventListener("click", playAudio);
    };

    window.addEventListener("click", playAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener("click", playAudio);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-8 py-6 flex items-center justify-between transition-all duration-700",
        isScrolled ? "bg-black/30 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-0.5 w-8 bg-white/20 hidden sm:block" />
        <span className="text-xl font-extrabold tracking-[0.3em] uppercase transition-all duration-500 hover:tracking-[0.4em] cursor-default">
          J & J
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-10">
        {/* Music Toggle */}
        <button
          onClick={toggleMusic}
          className="relative flex items-center gap-3 group"
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          <div className="relative flex items-center gap-1 h-5 w-8 justify-center">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  {[0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        height: [4, 16, 8, 20, 6],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay,
                        ease: "linear",
                      }}
                      className="w-[2px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="paused"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VolumeX size={18} className="text-white/40 group-hover:text-white transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors hidden sm:block">
            {isPlaying ? "Music On" : "Muted"}
          </span>
        </button>

        {/* RSVP CTA */}
        <button className="relative px-8 py-2.5 overflow-hidden group border border-white/10 rounded-full transition-all duration-500 hover:border-white">
          <span className="relative z-10 text-[11px] font-bold tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-500">
            RSVP
          </span>
          <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]" />
        </button>
      </div>
    </motion.nav>
  );
}
