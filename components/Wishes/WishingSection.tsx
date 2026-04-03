"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue, query, limitToLast } from "firebase/database";
import WishCard from "./WishCard";
import WishModal from "./WishModal";
import BubbleBackground from "./BubbleBackground";

interface Wish {
  id: string;
  name: string;
  wishText: string;
  timestamp: number;
}

export default function WishingSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate logic every 6 seconds
  useEffect(() => {
    if (wishes.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % wishes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [wishes.length]);

  // Real-time Firebase Listener
  useEffect(() => {
    const wishesRef = query(ref(db, "wishes"), limitToLast(50));
    const unsubscribe = onValue(wishesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const wishList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setWishes(wishList);
      } else {
        setWishes([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % wishes.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + wishes.length) % wishes.length);

  return (
    <section className="relative min-h-[140vh] bg-black py-40 overflow-hidden flex flex-col justify-center">
      {/* Background Visuals */}
      <BubbleBackground />
      
      {/* Cinematic Watermark */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.09] w-full text-center">
        <span className="text-[20vw] font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap">
           Guestbook
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col gap-24">
        {/* Content Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
           <header className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black tracking-[0.6em] uppercase text-white/30">
                   Whispers of Love
                </span>
                <div className="w-12 h-[1px] bg-white/20" />
              </div>
              <h2 className="text-6xl md:text-9xl font-extrabold tracking-[-0.05em] leading-[0.85] italic">
                 Hearts <span className="text-white/20">&</span> Words
              </h2>
              <p className="text-xl text-white/40 font-light leading-relaxed tracking-wide max-w-lg">
                 Every message is a leaf in the garden of our journey. 
                 Leave your blessing and join our digital legacy.
              </p>
           </header>
           
           <div className="flex lg:justify-end">
             <button
               onClick={() => setIsModalOpen(true)}
               className="group relative flex items-center gap-8 bg-white py-7 px-14 rounded-full overflow-hidden transition-all duration-700 hover:gap-12 hover:pr-16 active:scale-95 shadow-[0_30px_100px_-20px_rgba(255,255,255,0.15)]"
             >
                <div className="relative z-10 flex items-center justify-center p-2 rounded-full border border-black/10">
                  <Plus className="w-5 h-5 text-black" />
                </div>
                <span className="relative z-10 text-black text-xs font-black tracking-[0.4em] uppercase transition-colors duration-500">
                   Grant a Wish
                </span>
                <div className="absolute inset-0 bg-zinc-200 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]" />
             </button>
           </div>
        </div>

        {/* Carousel Area - Unstructured Custom Layout */}
        <div className="relative w-full overflow-hidden py-10" ref={carouselContainerRef}>
           {loading ? (
             <div className="h-[600px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <div className="w-16 h-[2px] bg-white/10 relative overflow-hidden">
                     <motion.div
                       animate={{ left: ["-100%", "100%"] }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                       className="absolute top-0 bottom-0 w-full bg-white shadow-[0_0_15px_#fff]"
                     />
                  </div>
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/20">Syncing Hearts</span>
                </div>
             </div>
           ) : wishes.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-[600px] flex flex-col items-center justify-center gap-8 text-center border border-white/5 rounded-[80px] bg-white/[0.01] backdrop-blur-3xl"
             >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-white/10" />
                  </div>
                  <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20" />
                </div>
                <div className="space-y-4">
                  <span className="text-[11px] font-black tracking-[0.6em] uppercase text-white/20">
                     The silence of first love
                  </span>
                  <p className="text-white/40 font-light italic text-2xl max-w-sm mx-auto">
                     "Our guestbook is waiting for your signature."
                  </p>
                </div>
             </motion.div>
           ) : (
             <div className="relative">
                {/* Horizontal Sliding List */}
                <motion.div 
                  className="flex gap-12 md:gap-20 transition-all cursor-default pr-[20vw]"
                  animate={{ x: `calc(-${activeIndex * 320}px - ${activeIndex * 48}px)` }}
                  transition={{ type: "spring", stiffness: 20, damping: 10 }}
                >
                   {wishes.map((wish, i) => (
                      <WishCard 
                        key={wish.id} 
                        name={wish.name} 
                        wishText={wish.wishText} 
                        index={i}
                      />
                   ))}
                </motion.div>
                
                {/* Visual Navigation Layer */}
                <div className="mt-24 flex items-center justify-between">
                   {/* Progress Indicator */}
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                         {wishes.slice(0, Math.min(wishes.length, 10)).map((_, i) => (
                           <button 
                             key={i} 
                             onClick={() => setActiveIndex(i)}
                             className={`h-2 rounded-full transition-all duration-700 ${activeIndex % wishes.length === i ? "bg-white w-12" : "bg-white/10 w-2 hover:bg-white/30"}`}
                           />
                         ))}
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
                         {String(activeIndex + 1).padStart(2, '0')} / {String(wishes.length).padStart(2, '0')}
                      </span>
                   </div>

                   {/* Custom Arrows */}
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={prevSlide} 
                        className="group w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:border-white transition-all duration-500 hover:scale-110"
                      >
                         <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      </button>
                      <button 
                        onClick={nextSlide} 
                        className="group w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:border-white transition-all duration-500 hover:scale-110"
                      >
                         <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <WishModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
