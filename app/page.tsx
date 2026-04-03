"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WishingSection from "@/components/Wishes/WishingSection";
import CountdownTimer from "@/components/CountdownTimer";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Home() {
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
        className="relative z-10 w-full min-h-screen bg-black flex items-center justify-center border-t border-white/5 py-20"
      >
         <div className="flex flex-col items-center gap-16 text-center max-w-4xl px-10">
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
