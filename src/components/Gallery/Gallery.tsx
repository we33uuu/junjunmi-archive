import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import GalleryCard from './GalleryCard';
import { IMAGES } from '../../data';
import { AppPhase } from '../../types';

interface GalleryProps {
  onFinale: () => void;
}

export default function Gallery({ onFinale }: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use framer motion scroll logic for parallax
  const { scrollXProgress } = useScroll({
    container: scrollRef
  });

  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track progress of the last card to trigger Finale
  useEffect(() => {
    const unsubscribe = scrollXProgress.on('change', (latest) => {
      if (latest > 0.999) {
        // Automatically trigger finale on horizontal scroll end if preferred, 
        // or keep the interactive CTA for more deliberate transition
        const timer = setTimeout(() => {
           onFinale();
        }, 1500);
        return () => clearTimeout(timer);
      }
    });
    return () => unsubscribe();
  }, [scrollXProgress, onFinale]);

  // Handle wheel to horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen bg-obsidian overflow-hidden flex flex-col">
      {/* Background Decor - Parallax Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <motion.div 
          className="absolute h-full w-[2px] bg-white/10 left-[20%]" 
          style={{ x: useTransform(smoothProgress, [0, 1], [0, -100]) }}
        />
        <motion.div 
          className="absolute h-full w-[2px] bg-white/10 right-[20%]" 
          style={{ x: useTransform(smoothProgress, [0, 1], [0, 100]) }}
        />
        <div className="absolute w-full h-[1px] top-1/2 bg-white/5" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 w-full flex items-center overflow-x-auto scrollbar-hide snap-x relative z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex gap-24 md:gap-40 px-[10vw] md:px-[25vw] items-center min-w-max pb-24">
          {IMAGES.map((img, i) => (
            <GalleryCard 
              key={i} 
              image={img} 
              index={i} 
              parallaxFactor={Math.sin(i * 1.5) * 0.5} 
            />
          ))}
          
          {/* Final Transition CTA */}
          <motion.div 
            className="flex flex-col items-center justify-center p-20 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "0px -10% 0px 0px" }}
          >
            <div className="w-40 h-40 rounded-full border border-gold/10 flex items-center justify-center relative group cursor-pointer"
                 onClick={onFinale}>
              <div className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-10 group-hover:opacity-30" />
              <div className="w-3 h-3 bg-gold/50 rounded-full blur-[1px]" />
            </div>
            <div className="text-center">
              <span className="text-[9px] tracking-[0.8em] uppercase text-gold/60 font-mono block mb-2">Finality Threshold</span>
              <h4 className="text-xl font-serif italic text-white/30 tracking-widest">Dissolve into the Night</h4>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar HUD - Moved to Top */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-white/10 z-20"
      >
        <motion.div 
          className="h-full bg-gold/50"
          style={{ scaleX: smoothProgress, originX: 0 }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-[7px] font-mono text-white/20 tracking-[0.4em]">ALPHA</span>
          <span className="text-[7px] font-mono text-white/20 tracking-[0.4em]">OMEGA</span>
        </div>
      </motion.div>

      {/* HUD Accents carried over from Phase 1 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-12 right-12 z-20 pointer-events-none hidden md:block text-right"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-mono">Location // Index</span>
        <span className="text-xs font-mono text-gold block">CORRIDOR_DEPTH: OFFSET_{Math.round(Math.random()*1000)}</span>
      </motion.div>
    </div>
  );
}
