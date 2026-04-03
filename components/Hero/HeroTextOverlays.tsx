"use client";

import { useTransform, motion, MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroTextOverlays({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {

  // SCROLL RANGES: 0 -> 1.0 (over 500vh territory)
  
  // Top-Left: Primary Headline (Names)
  const opacityTL = useTransform(scrollYProgress, [0, 0.1, 0.9, 0.98], [0, 1, 1, 0]);
  const yTL = useTransform(scrollYProgress, [0, 0.1, 0.9, 0.98], [30, 0, 0, -30]);

  // Top-Right: Supporting (Date/Location)
  const opacityTR = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95], [0, 1, 1, 0]);
  const yTR = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95], [30, 0, 0, -30]);

  // Bottom-Left: Emotional Microcopy
  const opacityBL = useTransform(scrollYProgress, [0.35, 0.45, 0.75, 0.85], [0, 1, 1, 0]);
  const yBL = useTransform(scrollYProgress, [0.35, 0.45, 0.75, 0.85], [30, 0, 0, -30]);

  // Bottom-Right: Primary CTA
  // We want this to fade out slightly before the absolute end to avoid overlap
  const opacityBR = useTransform(scrollYProgress, [0.55, 0.65, 0.9, 0.98], [0, 1, 1, 0]);
  const yBR = useTransform(scrollYProgress, [0.55, 0.65, 0.9, 0.98], [30, 0, 0, -30]);

  // Master visibility: Fade out as we reach the end of the section
  // With "end start" offset, 1.0 is the moment the section is fully gone.
  // Since the section is 500vh, the next section begins entering the viewport at 0.8 progress.
  // We MUST be completely hidden by 0.8 to avoid overlapping with content below.
  const masterOpacity = useTransform(scrollYProgress, [0, 0.02, 0.7, 0.8], [0, 1, 1, 0]);
  
  // Disable pointer events completely when faded out
  const masterPointerEvents = useTransform(scrollYProgress, (pos) => 
    pos < 0.8 ? "auto" : "none"
  );

  return (
    <motion.div 
      style={{ 
        opacity: masterOpacity,
        pointerEvents: masterPointerEvents as any
      }}
      className="fixed inset-0 z-20 pointer-events-none p-10 md:p-20 flex flex-col justify-between"
    >
      {/* Top Layer */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Top-Left: Primary Headline */}
        <motion.div 
          style={{ opacity: opacityTL, y: yTL }} 
          className="max-w-2xl"
        >
           <h1 className="text-6xl md:text-[140px] font-extrabold tracking-[-0.04em] leading-[0.8] mb-8 mt-[40px]">
               Jerrin <span className="opacity-20">&</span> Jesny
           </h1>
           <div className="h-[2px] w-32 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
        </motion.div>

        {/* Top-Right: Supporting line */}
        <motion.div 
          style={{ opacity: opacityTR, y: yTR }} 
          className="md:text-right"
        >
           <div className="flex flex-col gap-1 mt-[40px]">
             <span className="text-[11px] md:text-xs font-bold tracking-[0.5em] uppercase text-white/40">
                A Love That Began Then
             </span>
             <span className="text-2xl md:text-4xl font-bold tracking-tight uppercase">
                MAY<span className="text-white/20">|</span> 04 th <span className="text-white/20">|</span> 2026
             </span>
             <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase mt-2 opacity-60">
                Jeevz Square Convention Centre, Kallidukku, Thrissur
             </span>
           </div>
        </motion.div>
      </div>

      {/* Bottom Layer */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        {/* Bottom-Left: Emotional Microcopy */}
        <motion.div 
          style={{ opacity: opacityBL, y: yBL }} 
          className="max-w-sm"
        >
           <p className="text-xl md:text-2xl font-light italic leading-relaxed tracking-normal text-white/90">
             "Two lives, one story. Join us as we step into our forever after."
           </p>
        </motion.div>

        {/* Bottom-Right: Primary CTA */}
        {/* <motion.div 
          style={{ 
            opacity: opacityBR, 
            y: yBR
          }} 
          className="pointer-events-auto"
        >
           <button className="group relative flex items-center gap-8 bg-white py-6 px-12 rounded-full overflow-hidden transition-all duration-700 hover:gap-12 hover:pr-16 active:scale-95 shadow-2xl">
              <span className="relative z-10 text-black text-xs font-black tracking-[0.4em] uppercase transition-colors duration-500">
                 Explore
              </span>
              <ArrowRight className="relative z-10 text-black scale-110 group-hover:translate-x-2 transition-transform duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
           </button>
        </motion.div> */}
      </div>
    </motion.div>
  );
}
