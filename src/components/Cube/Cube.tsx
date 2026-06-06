import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGES, FALLBACK_IMAGES } from '../../data';

interface CubeProps {
  onFaceClick: (index: number) => void;
  isZooming: boolean;
}

export default function Cube({ onFaceClick, isZooming }: CubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeYRef = useRef<HTMLDivElement>(null); // Global Rotation (Y)
  const cubeXRef = useRef<HTMLDivElement>(null); // Local Rotation (X)
  
  const rotation = useRef({ x: -20, y: -30 });
  const velocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Phase 0 Entrance Animation
    if (cubeYRef.current && cubeXRef.current) {
      // Set initial state
      gsap.set(containerRef.current, { scale: 0, opacity: 0 });
      gsap.set(cubeXRef.current, { rotationX: -180 });

      // Build entrance timeline
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.to(containerRef.current, { 
        scale: 1, 
        opacity: 1, 
        duration: 2, 
        ease: "power2.out"
      });

      tl.to(cubeXRef.current, { 
        rotationX: rotation.current.x, 
        duration: 2.5, 
        ease: "power3.out"
      }, "-=1.5");
    }
  }, []);

  useEffect(() => {
    if (!cubeYRef.current || !cubeXRef.current || isZooming) return;

    const ticker = () => {
      // 1. BASE AUTO-ROTATION (The core heartbeat that never stops)
      const baseSpeedY = 0.28;
      const baseSpeedX = 0.15;

      if (!isDragging.current) {
        // Smoothly blend base speed with remaining user momentum
        rotation.current.y += baseSpeedY + velocity.current.y;
        rotation.current.x += baseSpeedX + velocity.current.x;
        
        // Decay user momentum but keep base heartbeat
        velocity.current.y *= 0.95;
        velocity.current.x *= 0.95;
      } else {
        // During drag, the base rotation still "accumulates" slightly 
        // to prevent a "dead stop" feeling when releasing
        rotation.current.y += baseSpeedY * 0.2; 
        rotation.current.x += baseSpeedX * 0.2;
      }
      
      // 2. APPLY TRANSFORMATIONS
      if (cubeYRef.current && cubeXRef.current) {
        gsap.set(cubeYRef.current, { rotationY: rotation.current.y });
        gsap.set(cubeXRef.current, { rotationX: rotation.current.x });
      }
    };

    gsap.ticker.add(ticker);
    return () => gsap.ticker.remove(ticker);
  }, [isZooming]);

  useEffect(() => {
    if (!containerRef.current || isZooming) {
      if (isZooming && containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 3,
          opacity: 0,
          z: 1000,
          rotateZ: 45,
          duration: 1.5,
          ease: "power3.in"
        });
      }
      return;
    }
    
    // Smoothly handle hover scale with GSAP to avoid CSS transition conflicts
    gsap.to(containerRef.current, {
      scale: isHovered ? 1.1 : 1,
      duration: 1.2,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, [isHovered, isZooming]);

  const startTime = useRef(0);
  const startPos = useRef({ x: 0, y: 0 });
  const lastClickTime = useRef(0);
  const clickedFaceIndex = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isZooming) return;
    
    // Do NOT set isDragging yet
    startTime.current = Date.now();
    startPos.current = { x: e.clientX, y: e.clientY };
    
    // Store the face index at the start of the interaction
    const target = e.target as HTMLElement;
    const faceDiv = target.closest('[data-face-index]');
    if (faceDiv) {
      clickedFaceIndex.current = parseInt(faceDiv.getAttribute('data-face-index') || '0', 10);
    } else {
      clickedFaceIndex.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isZooming) return;
    
    const dist = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y);

    // Lazy drag activation: Only start dragging after 5px of movement
    if (!isDragging.current && dist > 5) {
      isDragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    if (isDragging.current) {
      const sensitivity = 0.5;
      rotation.current.y += e.movementX * sensitivity;
      rotation.current.x -= e.movementY * sensitivity;
      
      velocity.current.y = e.movementX * 0.15;
      velocity.current.x = -e.movementY * 0.15;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = isDragging.current;
    isDragging.current = false;
    
    if (wasDragging) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } else {
      // Logic for double click detection could be added here, 
      // but to respect "Double click to enter" hint, we'll implement it.
      const duration = Date.now() - startTime.current;
      const dist = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y);
      
      if (duration < 500 && dist < 15 && clickedFaceIndex.current !== null) {
        console.log("=== Face Clicked", clickedFaceIndex.current, "===");
        onFaceClick(clickedFaceIndex.current);
      }
    }
    
    clickedFaceIndex.current = null;
  };

  const faces = [
    { transform: 'rotateY(0deg) translateZ(150px)' },
    { transform: 'rotateY(180deg) translateZ(150px)' },
    { transform: 'rotateY(90deg) translateZ(150px)' },
    { transform: 'rotateY(-90deg) translateZ(150px)' },
    { transform: 'rotateX(90deg) translateZ(150px)' },
    { transform: 'rotateX(-90deg) translateZ(150px)' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center perspective-2000 z-50"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 bg-black/40 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Nested Pivot: Y Axis (Global) */}
      <div ref={cubeYRef} className="relative w-[300px] h-[300px] preserve-3d">
        {/* Nested Pivot: X Axis (Local) */}
        <div ref={cubeXRef} className="relative w-full h-full preserve-3d">
           {faces.map((face, i) => (
            <div
              key={i}
              data-face-index={i}
              className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden border border-white/30 select-none backface-hidden group pointer-events-auto rounded-[2px]"
              style={{
                transform: face.transform,
                boxShadow: `
                  inset 0 0 100px rgba(0,0,0,0.4), 
                  0 0 40px rgba(212,175,55,0.08),
                  inset 0 0 30px rgba(255,255,255,0.1)
                `,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              }}
            >
              <img 
                src={IMAGES[i]} 
                alt={`Face ${i}`} 
                className={`w-full h-full object-cover block transition-all duration-1000 ${isHovered ? 'grayscale-0 scale-110 opacity-100' : 'grayscale brightness-40 scale-100 opacity-40'}`}
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGES[i];
                }}
              />
              
              {/* Glass Frosted Overlay & Specular highlights */}
              <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-tr from-white/30 via-transparent to-white/10 opacity-50 mix-blend-overlay" />
              <div className="absolute inset-0 z-[6] pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)] opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="absolute inset-0 z-[7] pointer-events-none backdrop-blur-[3px] opacity-40 group-hover:opacity-10 transition-all duration-1000" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-700 opacity-0 group-hover:opacity-100 z-10">
                <div className="absolute top-4 left-4 text-[8px] opacity-40 font-mono tracking-widest uppercase">
                  Data_Stream // 0{i + 1}
                </div>
                <div className="relative">
                  <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-2">Memory {i + 1}</h3>
                  <div className="w-full h-px bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
                </div>
              </div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Hint */}
      <AnimatePresence>
        {isHovered && !isZooming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-40 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-2 font-mono">
              Interconnection Protocol
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-gradient-to-l from-gold/50 to-transparent" />
              <span className="text-white/80 text-xs font-light tracking-[0.2em] whitespace-nowrap">
                { "点击图片开启记忆穿梭" }
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent" />
            </div>
            <div className="mt-4 flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 bg-gold rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
