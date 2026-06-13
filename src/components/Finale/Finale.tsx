import { useRef } from 'react';
import { motion } from 'motion/react';
import { STORIES } from '../../data';
import FluidBackground from './FluidBackground';

export default function Finale({ onReset }: { onReset: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] overflow-y-auto overflow-x-hidden selection:bg-gold/30">
      {/* WebGL Fluid Nebula Background */}
      <FluidBackground />

      {/* Vertical Content */}
      <div ref={contentRef} className="relative z-20 w-full max-w-4xl mx-auto px-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center min-h-screen flex flex-col items-center justify-center relative"
        >
          {/* Vertical Anchor Lead */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 80, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="w-[1px] bg-gradient-to-b from-transparent via-gold/60 to-transparent mx-auto mb-10"
          />

          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 0.6, letterSpacing: '1.5em' }}
            transition={{ duration: 1.2, delay: 0.25 }}
            className="text-[9px] md:text-[10px] uppercase text-gold font-mono block mb-12 pl-[1.5em]"
          >
            Final Protocol
          </motion.span>

          <h1 className="flex flex-col items-center select-none">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="text-5xl md:text-8xl font-serif italic text-white tracking-tight leading-none mb-6"
            >
              The Constellation
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
              className="text-7xl md:text-[10rem] font-serif italic text-white/90 tracking-tighter leading-none"
            >
              of Us
            </motion.span>
          </h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="h-[1px] bg-gold/30 mx-auto mt-16"
          />
        </motion.div>

        {/* Stories Section */}
        {STORIES.map((story, i) => (
          <div key={i} className="content-para min-h-screen flex items-center justify-center text-center group relative px-6">
            <MotionWrapper delay={0.2}>
              <div className="relative inline-block w-full">
                {/* Visual Anchor Line */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 0.15 }}
                  transition={{ duration: 2, delay: 0.4 }}
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gold"
                />

                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.8em] text-gold/40 uppercase mb-8 block pl-[0.8em]">
                  Chapter 0{i + 1}
                </span>

                <motion.h3 
                   initial={{ opacity: 0, filter: 'blur(15px)', y: 30 }}
                   whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                   transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                   className="text-4xl md:text-6xl font-serif italic text-white mb-12 tracking-tight group-hover:text-gold transition-colors duration-1000"
                >
                  {story.title}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.3 }}
                  className="max-w-3xl mx-auto"
                >
                  <p className="text-2xl md:text-4xl font-serif text-white/80 leading-[1.6] tracking-wide italic mix-blend-lighten">
                    “{story.content}”
                  </p>
                </motion.div>

                {/* COORDINATE FOOTPRINT */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.2 }}
                  transition={{ duration: 2, delay: 1 }}
                  className="mt-16 flex items-center justify-center gap-6"
                >
                  <div className="w-6 h-[1px] bg-white/40" />
                  <span className="text-[9px] font-mono tracking-[0.5em] text-white uppercase">
                    LOC_{story.date.replace(/\./g, '_')}
                  </span>
                  <div className="w-6 h-[1px] bg-white/40" />
                </motion.div>
                
                {/* Downward Anchor Line */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 0.15 }}
                  transition={{ duration: 2, delay: 0.4 }}
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gold"
                />
              </div>
            </MotionWrapper>
          </div>
        ))}

        {/* Reset Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="min-h-screen flex flex-col items-center justify-center text-center relative"
        >
          {/* Narrative Closure Lead */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 160 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent mx-auto mb-20"
          />

          <p className="text-[11px] font-mono tracking-[1.2em] uppercase text-gold/40 mb-24 pl-[1.2em]">
            End of Record // Forever Signal
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <button
              onClick={onReset}
              className="group relative px-14 py-6 overflow-visible transition-all duration-700"
              style={{
                color: '#E6C687',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {/* Outer Pulsing Ring */}
              <div className="absolute inset-0 border border-[#E6C687]/15 rounded-full transform scale-110 group-hover:scale-130 group-hover:opacity-0 transition-all duration-1000" />
              
              {/* Main Border Ring */}
              <div className="absolute inset-0 border border-[#E6C687]/40 rounded-full transform group-hover:border-[#E6C687]/80 group-hover:scale-105 transition-all duration-700" />
              
              {/* Inner Glow/Fill */}
              <div className="absolute inset-[3px] bg-[#E6C687]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-[3px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-sans text-[12px] tracking-[0.6em] group-hover:tracking-[1em] transition-all duration-700 uppercase opacity-80 group-hover:opacity-100">
                  返回首页
                </span>
                <span className="font-mono text-[8px] tracking-[0.4em] uppercase opacity-30 group-hover:opacity-50 transition-all duration-700 mt-2">
                  Return to Origin
                </span>
              </div>

              {/* Decorative Scan Line */}
              <motion.div 
                animate={{ top: ['0%', '100%'], opacity: [0, 0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-gold/25 pointer-events-none"
              />
            </button>

            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: 60 }}
              transition={{ duration: 2, delay: 1.2 }}
              className="w-[1px] bg-gradient-to-b from-gold/40 to-transparent mt-12"
            />
          </motion.div>
        </motion.div>
      </div>



    </div>
  );
}

function MotionWrapper({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-15% 0px -15% 0px", once: true }}
      transition={{ 
        duration: 2, 
        delay, 
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 1.5, delay },
        scale: { duration: 2.5, delay: delay + 0.2 }
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
