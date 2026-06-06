import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMAGES, STORIES, FALLBACK_IMAGES } from '../../data';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function Finale({ onReset }: { onReset: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stars = useRef<Star[]>([]);
  const mouseTrail = useRef<TrailPoint[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const [paragraphY, setParagraphY] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate paragraph positions for constellation lines
  useEffect(() => {
    const updateParaPositions = () => {
      if (!contentRef.current) return;
      const paras = contentRef.current.querySelectorAll('.content-para');
      const positions = Array.from(paras).map(p => {
        const rect = (p as HTMLElement).getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      setParagraphY(positions);
    };

    window.addEventListener('scroll', updateParaPositions);
    window.addEventListener('resize', updateParaPositions);
    updateParaPositions();
    
    return () => {
      window.removeEventListener('scroll', updateParaPositions);
      window.removeEventListener('resize', updateParaPositions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize stars (fireflies)
      stars.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random(),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrame: number;
    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Fireflies
      stars.current.forEach(star => {
        star.x += star.vx + Math.sin(time * 0.001 + star.x) * 0.2;
        star.y += star.vy + Math.cos(time * 0.001 + star.y) * 0.2;
        
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 198, 135, ${Math.sin(time * 0.002 + star.x) * 0.5 + 0.5})`;
        ctx.fill();
        
        // Slight glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#E6C687';
      });
      ctx.shadowBlur = 0;

      // 2. Magic Wand & Sparkles
      // Continuous emission from wand tip
      if (time % 4 < 1 && mousePos.current.x !== 0) {
         mouseTrail.current.push({ 
           x: mousePos.current.x + (Math.random() - 0.5) * 5, 
           y: mousePos.current.y + (Math.random() - 0.5) * 5, 
           age: Math.random() * 0.2
         });
      }

      // Update mouse trail logic to be sparkles
      mouseTrail.current.forEach((point) => {
        point.age += 0.02; // Slower aging for longer tail
        
        // Draw individual sparkle
        const size = Math.max(0, (1 - point.age) * 2);
        const opacity = Math.max(0, (1 - point.age));
        
        ctx.beginPath();
        // Star shape for sparkle
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
          const outerX = point.x + Math.cos(angle) * size * 3;
          const outerY = point.y + Math.sin(angle) * size * 3;
          ctx.lineTo(outerX, outerY);
          
          const innerAngle = angle + Math.PI / 4;
          const innerX = point.x + Math.cos(innerAngle) * size;
          const innerY = point.y + Math.sin(innerAngle) * size;
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        
        // Multi-layered glow for each sparkle
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.shadowBlur = 4 * opacity;
        ctx.shadowColor = '#E6C687';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0, size * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 198, 135, ${opacity * 0.3})`;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      mouseTrail.current = mouseTrail.current.filter(p => p.age < 1);

      // Draw Wand Handle (only if mouse has moved)
      if (mousePos.current.x !== 0) {
        const wandLen = 35;
        const angle = -Math.PI / 4; // 45 degree tilt
        ctx.save();
        ctx.translate(mousePos.current.x, mousePos.current.y);
        ctx.rotate(angle);
        
        // Wand Body
        const wandGrad = ctx.createLinearGradient(0, 0, 0, wandLen);
        wandGrad.addColorStop(0, '#FFFFFF');
        wandGrad.addColorStop(0.2, '#E6C687');
        wandGrad.addColorStop(1, '#3D2B1F');
        
        ctx.fillStyle = wandGrad;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(230, 198, 135, 0.5)';
        ctx.fillRect(-1.5, 0, 3, wandLen);
        
        // Wand Tip Glow (The magic point)
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFF';
        ctx.fill();
        
        // Outer tip ring
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(230, 198, 135, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        ctx.shadowBlur = 0;
      }

          // 3. Constellation Lines
      const memoryStars = IMAGES.map((_, i) => {
        // More dramatic deep-space positions with Z-depth (simulated by scale/position)
        const xOffsets = [0.12, 0.85, 0.28, 0.72, 0.08, 0.92];
        const yOffsets = [0.08, 0.25, 0.65, 0.88, 0.42, 0.12];
        return {
          x: canvas.width * xOffsets[i % 6],
          y: canvas.height * yOffsets[i % 6],
          index: i
        };
      });

      // Draw lines between the current active text segment and its specific memory star
      const screenCenter = canvas.height / 2;
      let activeIdx = -1;
      let minCenterDist = Infinity;

      paragraphY.forEach((py, idx) => {
        const dist = Math.abs(py - screenCenter);
        if (dist < minCenterDist && dist < screenCenter * 0.35) {
          minCenterDist = dist;
          activeIdx = idx;
        }
      });

      if (activeIdx !== -1) {
        const py = paragraphY[activeIdx];
        const ms = memoryStars[activeIdx % memoryStars.length];
        
        // Intensity peaks at center
        const intensity = 1 - (minCenterDist / (screenCenter * 0.35));
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, py);
        
        // Growth factor: lines grow into place
        const growth = Math.min(1, intensity * 2);
        const dx = (ms.x - canvas.width / 2) * growth;
        const dy = (ms.y - py) * growth;
        
        ctx.lineTo(canvas.width / 2 + dx, py + dy);
        
        const pulse = Math.sin(time * 0.003 + activeIdx) * 0.2 + 0.8;
        ctx.strokeStyle = `rgba(212, 175, 55, ${intensity * 0.5 * pulse})`;
        ctx.lineWidth = 0.5 + intensity * 0.5;
        ctx.stroke();

        // Star impact glow
        if (growth > 0.9) {
          ctx.beginPath();
          ctx.arc(ms.x, ms.y, 6 * intensity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${intensity * 0.3 * pulse})`;
          ctx.fill();
        }
      }
      
      // Still draw subtle connection points at stars
      memoryStars.forEach((ms, i) => {
        const pulse = Math.sin(time * 0.002 + i) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(ms.x, ms.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${0.4 * pulse})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      // Add multiple sparkles at once for a richer effect
      for (let i = 0; i < 2; i++) {
        mouseTrail.current.push({ 
          x: e.clientX + (Math.random() - 0.5) * 10, 
          y: e.clientY + (Math.random() - 0.5) * 10, 
          age: Math.random() * 0.2 // Slightly staggered ages
        });
      }
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Hide cursor on final page
    document.body.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, [paragraphY]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] overflow-y-auto overflow-x-hidden selection:bg-gold/30">
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
      />

      {/* Vertical Content */}
      <div ref={contentRef} className="relative z-20 w-full max-w-4xl mx-auto px-8">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center min-h-screen flex flex-col items-center justify-center relative"
        >
          {/* Vertical Anchor Lead */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: 80, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-[1px] bg-gradient-to-b from-transparent via-gold/60 to-transparent mx-auto mb-10"
          />

          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 0.6, letterSpacing: "1.5em" }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-[9px] md:text-[10px] uppercase text-gold font-mono block mb-12 pl-[1.5em]"
          >
            Final Protocol
          </motion.span>

          <h1 className="flex flex-col items-center select-none">
            <motion.span 
              initial={{ opacity: 0, filter: "blur(20px)", y: 40, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: "-0.02em" }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 1 }}
              className="text-5xl md:text-8xl font-serif italic text-white tracking-tight leading-none mb-6"
            >
              The Constellation
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, filter: "blur(20px)", y: 40, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: "-0.05em" }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
              className="text-7xl md:text-[10rem] font-serif italic text-white/90 tracking-tighter leading-none"
            >
              of Us
            </motion.span>
          </h1>

          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 60, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
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

      {/* Floating Memory Orbs (Images turned Cinematic Planets) */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {IMAGES.map((img, i) => {
          // Distributed positions
          const xOffsets = [0.12, 0.82, 0.22, 0.78, 0.08, 0.92];
          const yOffsets = [0.15, 0.28, 0.65, 0.82, 0.45, 0.18];
          const scales = [0.5, 0.65, 0.45, 0.55, 0.5, 0.4];
          
          // Unique atmospheric colors for each planet
          const planetColors = [
            'rgba(147, 51, 234, 0.4)', // Violet
            'rgba(59, 130, 246, 0.4)',  // Blue
            'rgba(245, 158, 11, 0.4)',  // Amber
            'rgba(16, 185, 129, 0.4)',  // Emerald
            'rgba(236, 72, 153, 0.4)',  // Pink
            'rgba(99, 102, 241, 0.4)',  // Indigo
          ];
          
          const currentColor = planetColors[i % planetColors.length];
          
          return (
            <motion.div
              key={i}
              className="absolute group"
              initial={{ 
                scale: 0.1, 
                opacity: 0,
                x: '-50%',
                y: '-50%',
                left: '50%',
                top: '50%'
              }}
              animate={{ 
                opacity: [0.7, 1, 0.7], 
                scale: [scales[i], scales[i] * 1.05, scales[i]],
                left: `${xOffsets[i] * 100}%`,
                top: `${yOffsets[i] * 100}%`
              }}
              transition={{ 
                duration: 12 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                left: { duration: 6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
                top: { duration: 6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
                opacity: { duration: 4, delay: i * 0.3 }
              }}
              style={{
                width: '180px',
                height: '180px',
              }}
            >
              {/* 1. PLANET CORE CONTAINER */}
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.03)] bg-black">
                {/* 2. SURFACE & SLOW ROTATION */}
                <motion.div 
                  className="w-full h-full relative"
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 400, repeat: Infinity, ease: "linear" }}
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover brightness-[0.8] contrast-[1.2] opacity-90 transition-all duration-1000" 
                    style={{
                      filter: `saturate(1.3) hue-rotate(${i * 30}deg)`,
                    }}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGES[i])}
                  />
                  <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                </motion.div>

                {/* 4. BALANCED SHADING (Spherical shadow) */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, transparent 20%, rgba(0,0,0,0.85) 90%)',
                  }}
                />

                {/* 5. VIBRANT RIM LIGHTING */}
                <div 
                  className="absolute inset-0 pointer-events-none z-20 opacity-40 mix-blend-screen"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 50%)',
                  }}
                />

                {/* 6. ATMOSPHERIC TINT OVERLAY */}
                <div 
                  className="absolute inset-0 z-[15] mix-blend-overlay opacity-30 pointer-events-none"
                  style={{ backgroundColor: currentColor }}
                />

                {/* 7. SILVER CORONA */}
                <div className="absolute inset-0 rounded-full border border-white/10 z-30 pointer-events-none" />
              </div>

              {/* 8. MICRO ORBITAL PARTICLES */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-15%] pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/40 rounded-full blur-[0.5px]" />
                <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-gold/20 rounded-full blur-[1.5px]" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

function MotionWrapper({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-15% 0px -15% 0px", once: false }}
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
