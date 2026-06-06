import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PeekingGuardianProps {
  children: React.ReactNode;
}

export const PeekingGuardian: React.FC<PeekingGuardianProps> = ({ children }) => {
  const [isPeeking, setIsPeeking] = useState(false);
  const [isStartled, setIsStartled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (showMessage || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + 
        Math.pow(e.clientY - centerY, 2)
      );

      // Interactive Proximity Logic:
      // 1. If very close (< 80px), it gets scared and ducks back in (unless it's already talking).
      // 2. If at medium range (80px - 350px), it curiosity peeks out to watch you move.
      // 3. If too far away, it goes back to sleep.
      
      // Updated Logic: Easier to catch
      // Instead of getting scared when close, it stays out as long as you're in range (< 350px)
      // and only performs a subtle 'nervous wiggle' when you're very close (< 100px)
      
      if (distance < 350) {
        if (!isPeeking) {
          setIsPeeking(true);
        }
        // If very close, trigger the 'ready to be petted' wiggle
        if (distance < 100) {
          setIsStartled(true);
        } else {
          setIsStartled(false);
        }
      } else {
        if (isPeeking && !showMessage) {
          setIsPeeking(false);
          setIsStartled(false);
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isPeeking, showMessage]);

  const handleClick = (e: React.MouseEvent) => {
    // We allow propagation so that clicking the letter/character can still trigger the scene entry
    // but the message will still show up as expected.
    setShowMessage(true);
    setIsPeeking(true);
    setIsStartled(false);
    
    setTimeout(() => {
      setShowMessage(false);
      setIsPeeking(false);
    }, 4000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block cursor-pointer"
    >
      <AnimatePresence>
        {isPeeking && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: -35, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.5, transition: { duration: 0.2, ease: "circIn" } }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-20"
            onClick={handleClick}
          >
            {/* Dialogue Bubble */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/80 border border-[#E6C687]/40 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(230,198,135,0.2)]"
                >
                  <span className="text-[#E6C687] font-serif italic text-sm tracking-widest">
                    love 珺珺咪
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }} 
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-1 inline-block"
                    >
                      ❤
                    </motion.span>
                  </span>
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-[#E6C687]/40 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{ 
                y: [0, -1, 0],
                rotate: [0, -1, 1, 0],
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative"
            >
              <div className="absolute -top-1 left-0 w-full">
                <motion.div 
                  className="absolute left-1 w-2 h-2 bg-black border-l border-t border-[#E6C687]/20 rounded-tl-sm"
                  style={{ transform: 'rotate(-15deg)' }}
                  animate={{ rotate: [-15, -25, -15] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
                />
                <motion.div 
                  className="absolute right-1 w-2 h-2 bg-black border-r border-t border-[#E6C687]/20 rounded-tr-sm"
                  style={{ transform: 'rotate(15deg)' }}
                  animate={{ rotate: [15, 25, 15] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4.5 }}
                />
              </div>

              <div className="relative w-12 h-10 bg-black rounded-t-full border border-[#E6C687]/30 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-3 left-0 w-full flex justify-center space-x-3">
                  <motion.div 
                    className="w-1.5 h-3 bg-[#E6C687] rounded-full shadow-[0_0_8px_#E6C687]"
                    animate={{ 
                      scaleY: [1, 0.1, 1],
                      x: [-1, 1, -1],
                    }}
                    transition={{ 
                      scaleY: { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], repeatDelay: 3 },
                      x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  <motion.div 
                    className="w-1.5 h-3 bg-[#E6C687] rounded-full shadow-[0_0_8px_#E6C687]"
                    animate={{ 
                      scaleY: [1, 0.1, 1],
                      x: [-1, 1, -1],
                    }}
                    transition={{ 
                      scaleY: { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], repeatDelay: 3.1 },
                      x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#E6C687]/5 to-transparent top-1/2" />
              </div>
            </motion.div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#E6C687]/5 blur-md rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        animate={isStartled ? { 
          y: [0, -2, 0],
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1]
        } : {}}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {children}
      </motion.span>
    </div>
  );
};
