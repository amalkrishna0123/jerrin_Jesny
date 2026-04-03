"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useTransform, useSpring, motion, AnimatePresence, MotionValue } from "framer-motion";

export default function HeroCanvas({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth the scroll progress for cinematic frame transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const frameCount = 191;

  // Generate image paths
  const framePaths = useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => {
      const frameNum = (i + 1).toString().padStart(3, "0");
      // Adjusting to the naming convention seen in the dir listing (ezgif-frame-001.jpg)
      return `/images/ezgif-frame-${frameNum}.jpg`;
    });
  }, []);

  // Map smooth progress to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    let isCancelled = false;

    async function preloadAll() {
      const BATCH_SIZE = 30; // Load 30 images at a time to stay under browser connection limits
      
      for (let i = 0; i < framePaths.length; i += BATCH_SIZE) {
        if (isCancelled) break;

        const batch = framePaths.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((path, index) => {
          const globalIndex = i + index;
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
              if (isCancelled) return resolve();
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / frameCount) * 100));
              if (loadedCount === frameCount) setIsLoaded(true);
              resolve();
            };
            img.onerror = () => {
              // Simple retry: try one more time if it fails
              img.onerror = () => {
                if (isCancelled) return resolve();
                console.warn(`Final failure loading frame: ${path}`);
                loadedCount++; // Count it anyway to resolve loader
                resolve();
              };
              img.src = path;
            };
            loadedImages[globalIndex] = img;
          });
        }));
      }

      if (!isCancelled) {
        setImages(loadedImages);
      }
    }

    preloadAll();

    return () => {
      isCancelled = true;
      loadedImages.forEach((img) => { if (img) img.src = ""; });
    };
  }, [framePaths]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let animationFrameId: number;

    const drawFrame = () => {
      const index = Math.round(frameIndex.get());
      const img = images[index];

      if (img && img.complete) {
        // Responsive "Cover" Sizing Logic
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const canvasRatio = canvasWidth / canvasHeight;
        const imgRatio = imgWidth / imgHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvasWidth;
          drawHeight = canvasWidth / imgRatio;
          offsetX = 0;
          offsetY = (canvasHeight - drawHeight) / 2;
        } else {
          drawWidth = canvasHeight * imgRatio;
          drawHeight = canvasHeight;
          offsetX = (canvasWidth - drawWidth) / 2;
          offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      animationFrameId = requestAnimationFrame(drawFrame);
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Update CSS dimensions
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, frameIndex]);

  return (
    <div className="relative h-full w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Jerrin & Jesny wedding story sequence"
          className="block w-full h-full object-cover"
        />
        
        {/* Cinematic Overlays: Gradient masking for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none opacity-80" />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Loading Experience */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
            >
              <div className="relative flex flex-col items-center gap-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[1px] bg-white/10 relative"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: loadProgress / 100 }}
                    className="absolute inset-0 bg-white origin-left shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
                </motion.div>
                
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-medium tracking-[0.5em] uppercase text-white/40">
                    Jerrin & Jesny
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20">
                    {loadProgress}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
