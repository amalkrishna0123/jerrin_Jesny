"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WishingSection from "@/components/Wishes/WishingSection";
import CountdownTimer from "@/components/CountdownTimer";
import { useInView, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);  // <section> is an HTMLElement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms with varied speeds
  // Image 1: slow upward
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  // Image 2: faster than first
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -300]);
  // Image 3: slower than first
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  // Image 4: medium speed
  const y4 = useTransform(scrollYProgress, [0, 1], [150, -200]);

  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      
      {/* 
        The Hero component handles the 500vh scroll-synced image sequence 
        and the four-corner text overlays.
      */}
      <Hero />
      
      {/* 
        Supporting Content: 
        A smooth transition into the invitation details.
      */}
      <section 
        ref={containerRef}
        className="relative z-10 w-full min-h-screen bg-black flex items-center justify-center border-t border-white/5 py-20 overflow-hidden"
      >
         {/* Parallax Background Images */}
         <motion.div 
            style={{ y: y1 }}
            className="absolute top-[10%] left-[5%] w-64 h-80 md:w-80 md:h-96 opacity-[0.0] grayscale z-0 pointer-events-none"
         >
            <img src="/assets/Us/1.jpeg" alt="" className="w-full h-full object-cover rounded-2xl" />
         </motion.div>

         <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-[5%] right-[2%] w-72 h-96 md:w-96 md:h-[30rem] opacity-[0.00] grayscale z-0 pointer-events-none"
         >
            <img src="/assets/Us/2.jpeg" alt="" className="w-full h-full object-cover rounded-2xl" />
         </motion.div>

         <motion.div 
            style={{ y: y3 }}
            className="absolute top-[15%] right-[5%] w-48 h-64 md:w-64 md:h-80 opacity-[0.5] grayscale z-0 pointer-events-none"
         >
            <img src="/assets/Us/3.jpeg" alt="" className="w-full h-full object-cover rounded-2xl" />
         </motion.div>

         <motion.div 
            style={{ y: y4 }}
            className="absolute bottom-[15%] left-[8%] w-56 h-72 md:w-72 md:h-96 opacity-[0.5] grayscale z-0 pointer-events-none"
         >
            <img src="/assets/Us/4.jpeg" alt="" className="w-full h-full object-cover rounded-2xl" />
         </motion.div>

         <div className="relative z-10 flex flex-col items-center gap-16 text-center max-w-4xl px-10">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[11px] font-black tracking-[0.6em] uppercase text-white/30">
                 Saved in Our Hearts
              </span>
              <div className="w-12 h-[1px] bg-white/20" />
            </div>
            
            <h2 className="text-5xl md:text-8xl font-light tracking-tight italic leading-[1.1]">
               "Love is not just looking at each other, but looking in the same direction."
            </h2>
            
            <div className="flex flex-col items-center gap-8 max-w-xl">
               <p className="text-xl text-white/50 font-light leading-relaxed tracking-wide">
                  Welcome to our digital invitation. This experience was crafted 
                  to share the intimacy and joy of our union. 
                  Scroll down to explore the details of our celebration.
               </p>
               
               <div className="flex items-center gap-12 mt-8">
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-3xl font-bold">
                        <CountdownTimer />
                     </span>
                     <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 text-white">Days Left</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-3xl font-bold">45</span>
                     <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 text-white">Minutes From Airport</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Premium Wishing Section with Firebase Sync */}
      <WishingSection />
    </main>
  );
}
