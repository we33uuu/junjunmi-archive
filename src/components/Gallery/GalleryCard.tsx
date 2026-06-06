import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORIES, FALLBACK_IMAGES } from '../../data';

interface GalleryCardProps {
  image: string;
  index: number;
  parallaxFactor: number;
  key?: React.Key;
}

export default function GalleryCard({ image, index, parallaxFactor }: GalleryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const story = STORIES[index];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.8, rotateY: 30 }}
      animate={{ opacity: 1, y: parallaxFactor * 100, scale: 1, rotateY: 0 }}
      transition={{ 
        delay: index * 0.15 + 0.5, 
        duration: 1.5, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="relative flex-shrink-0 w-[85vw] md:w-[450px] aspect-[3/4] md:aspect-[2/3] preserve-3d cursor-pointer group"
      style={{
        marginTop: index % 2 === 0 ? '0' : '8rem'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full preserve-3d relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FRONT: Image */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
          <img 
            src={image} 
            alt={story.title} 
            className="w-full h-full object-cover block grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGES[index];
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6 text-left">
            <span className="text-[10px] font-mono tracking-[0.2em] text-gold uppercase opacity-60 mb-2 block">
              Entry // 0{index + 1}
            </span>
            <h3 className="text-2xl font-serif italic text-white tracking-tight">{story.title}</h3>
          </div>
          {/* Corner frame */}
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
        </div>

        {/* BACK: Handwritten Letter */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden bg-[#fbf8f3] p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-sm border border-neutral-200"
          style={{
            transform: 'rotateY(180deg)',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(240,230,210,0.5)), url("https://www.transparenttextures.com/patterns/natural-paper.png")',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div className="w-full h-full flex flex-col">
            <div className="mb-4 flex justify-between items-baseline border-b border-black/5 pb-3">
              <span className="font-mono text-[8px] uppercase tracking-widest text-black/30">Archives // Memo</span>
              <span className="font-mono text-[8px] text-black/30">{story.date}</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="w-full text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 1.2 }}
                    >
                      <p className="text-xl md:text-2xl text-neutral-800 font-serif leading-relaxed italic mb-8 relative px-4">
                         {story.content}
                      </p>
                    </motion.div>
                    
                    <div className="relative w-full h-16 opacity-30 invert">
                      <svg 
                        viewBox="0 0 200 60" 
                        className="w-full h-full overflow-visible"
                      >
                        <motion.path
                          d={story.path}
                          fill="transparent"
                          stroke="black"
                          strokeWidth="0.75"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.2, duration: 4, ease: "easeInOut" }}
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-6 pt-4 border-t border-black/5 flex flex-col items-center">
              <div className="text-[9px] font-mono tracking-[0.3em] uppercase text-black/30 animate-pulse">
                Click to Restore
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
