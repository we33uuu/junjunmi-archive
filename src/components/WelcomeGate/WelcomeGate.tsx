import { useRef, useEffect, useState } from 'react';
import { motion as Motion } from 'motion/react';
import gsap from 'gsap';
import LiquidBackground from './LiquidBackground';
import { PeekingGuardian } from './PeekingGuardian';
import { CosmicAtmosphere } from './CosmicAtmosphere';

interface WelcomeGateProps {
  onEnter: () => void;
}

const TEXT_ITEMS = [
  "PROJECT // JUNJUNMI",
  "ESTABLISHING CONNECTION",
  "ARCHIVE",
  "CREATING THE UNEXPECTED",
  "VISUAL ARCHITECTURE",
  "PHASE 0 // INITIALIZING",
  "PROTOCOL.V1.2",
  "OBSIDIAN.GOTHIC"
];

export default function WelcomeGate({ onEnter }: WelcomeGateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Starfield Canvas Implementation - Organic Twinkle & Cluster breathing
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let animationFrameId: number;
        let stars: { x: number; y: number; size: number; opacity: number; phase: number; freq: number; speed: number; color: string; cluster: number }[] = [];
        let shootingStars: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];

        const initStars = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          stars = [];
          for (let i = 0; i < 280; i++) {
            const z = Math.random(); 
            stars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: z * 1.1 + 0.2,
              opacity: Math.random() * 0.7 + 0.1,
              phase: Math.random() * Math.PI * 2,
              freq: Math.random() * 0.001 + 0.0005, // Breathing frequency
              speed: z * 0.05 + 0.015,
              color: z > 0.85 ? '#E6C687' : z > 0.6 ? '#FFFFFF' : '#8898AA',
              cluster: Math.floor(Math.random() * 3) // 3 distinct sinus pulses
            });
          }
        };

        const draw = (time: number) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          stars.forEach(star => {
            // Cluster-based Organic Twinkling (Breathing cycles: ~4-6s)
            let pulseFreq = 0.0011; // ~5.7s
            if (star.cluster === 1) pulseFreq = 0.0013; // ~4.8s
            if (star.cluster === 2) pulseFreq = 0.0015; // ~4.2s

            const breathing = Math.sin(time * pulseFreq + star.phase);
            const currentOpacity = Math.max(0.05, Math.min(0.9, star.opacity + (breathing * 0.45)));
            
            ctx.fillStyle = star.color;
            ctx.globalAlpha = currentOpacity;
            
            if (star.size > 0.9) {
              ctx.shadowBlur = 3;
              ctx.shadowColor = star.color;
            } else {
              ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Parallax drifting movement
            star.y -= star.speed;
            if (star.y < -10) {
              star.y = canvas.height + 10;
              star.x = Math.random() * canvas.width;
            }
          });

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          if (Math.random() < 0.012 && shootingStars.length < 2) {
            shootingStars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height * 0.3,
              length: Math.random() * 100 + 50,
              speed: Math.random() * 15 + 10,
              opacity: 0.9
            });
          }

          shootingStars.forEach((ss, index) => {
            ss.x += ss.speed;
            ss.y += ss.speed * 0.3;
            ss.opacity -= 0.015;

            if (ss.opacity <= 0) {
              shootingStars.splice(index, 1);
            } else {
              const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y - ss.length * 0.3);
              grad.addColorStop(0, `rgba(230, 198, 135, ${ss.opacity})`);
              grad.addColorStop(1, 'transparent');
              
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(ss.x, ss.y);
              ctx.lineTo(ss.x - ss.length, ss.y - ss.length * 0.3);
              ctx.stroke();
            }
          });

          animationFrameId = requestAnimationFrame(draw);
        };

        initStars();
        draw(0);
        window.addEventListener('resize', initStars);
        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', initStars);
        };
      }
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".welcome-content > *", {
        y: 60,
        opacity: 0,
        duration: 2.5,
        stagger: 0.25,
        ease: "power4.out",
        delay: 0.3
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPos = (e.clientX / innerWidth) - 0.5;
        const yPos = (e.clientY / innerHeight) - 0.5;

        // Update CSS variables for interactive glow
        if (containerRef.current) {
          containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
          containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
        }

        // Cinematic Camera Depth (Parallax: max 6px canvas, 3px title, 2px button)
        if (!isTransitioning) {
          // 1. Canvas drifts opposite and deep (Background layer) - max 6px from center
          if (canvasRef.current) {
            gsap.to(canvasRef.current, {
              x: -xPos * 12,
              y: -yPos * 12,
              duration: 1.5,
              ease: "power2.out"
            });
          }

          // 2. Title drifts aligned with mouse (Foreground layer) - max 3px from center
          if (nameRef.current) {
            gsap.to(nameRef.current, {
              x: xPos * 6,
              y: yPos * 6,
              duration: 1.5,
              ease: "power2.out"
            });
          }

          // 3. Enter Button drifts slightly opposite (Mid layer) - max 2px from center
          gsap.to("#enter-btn", {
            x: -xPos * 4,
            y: -yPos * 4,
            duration: 1.5,
            ease: "power2.out"
          });

          // 4. Content rotation (Core 3D feel)
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              rotateY: xPos * 8, 
              rotateX: -yPos * 6,
              duration: 1.2,
              ease: "power2.out"
            });
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) return;

    // Phase 0: The Light Singularity (Cinematic Overhaul)
    const tl = gsap.timeline();

    // 1. Initial UI Dissolve
    tl.to(".welcome-content", {
      opacity: 0,
      scale: 0.8,
      filter: "blur(20px)",
      duration: 1,
      ease: "power4.inOut"
    });

    tl.to("#starfield-canvas", {
      opacity: 0,
      duration: 1
    }, "<");

    tl.to(containerRef.current, {
      backgroundColor: "#000",
      duration: 0.5
    }, "<");

    // 2. Reveal The Singularity Screen
    tl.to(loadingScreenRef.current, {
      opacity: 1,
      duration: 0.1
    });

    // 2.1 Animate the Brand Logo Entry
    tl.fromTo(".brand-logo-singularity",
      { scale: 0.5, opacity: 0, filter: "blur(20px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" },
      "-=0.5"
    );

    // 3. Kinetic Progress Sequence
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 4.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = Math.floor(obj.val);
        setProgress(p);

        const intensity = p / 100;
        
        // Speed up the radial streaks
        gsap.to(".light-streak", {
           z: (i: number) => ((i * 50) + (intensity * 6000)) % 4000,
           opacity: (i: number) => {
              const currentZ = ((i * 50) + (intensity * 6000)) % 4000;
              return currentZ > 3000 ? 0 : Math.max(0, Math.min(0.6, (currentZ / 3000)));
           },
           duration: 0.1,
           overwrite: "auto"
        });
      }
    }, "<");

    // 4. THE RADIAL SINGULARITY (New Transition)
    tl.add(() => {
      onEnter();
    }, "+=0.1");

    const radialObj = { radius: 0, blur: 50 };
    tl.to(radialObj, {
      radius: 150,
      blur: 0,
      duration: 3,
      ease: "power3.inOut",
      onUpdate: () => {
        if (containerRef.current) {
          const mask = `radial-gradient(circle at center, transparent ${radialObj.radius - 20}%, black ${radialObj.radius}%)`;
          containerRef.current.style.maskImage = mask;
          containerRef.current.style.webkitMaskImage = mask;
          containerRef.current.style.filter = `blur(${radialObj.blur}px)`;
        }
      }
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.in"
    }, "-=1.0");

  }, [isTransitioning]);

  const handleEnter = () => {
    setIsTransitioning(true);
  };

  return (
    <div 
      id="welcome-gate-wrapper" 
      className="fixed inset-0 w-full h-full z-[10000] overflow-hidden pointer-events-none"
    >
      <div 
        id="welcome-gate"
        ref={containerRef}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#050406] cursor-default pointer-events-auto"
      >
        {/* Starfield Background */}
        <canvas 
          ref={canvasRef}
          id="starfield-canvas"
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Cosmic Atmosphere (Shards, Nebulae, Meteors) */}
        <CosmicAtmosphere />

        {/* Interactive Reveal Glow - Wider but softer */}
        <div 
          className="absolute inset-0 z-[3] pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230,198,135,0.06), transparent 80%)`
          }}
        />

        {/* Film Grain Texture Overlay - Premium Polish */}
        <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay">
          <svg className="w-full h-full">
            <filter id="grainy">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainy)" />
          </svg>
        </div>

        {/* Cosmic Nebula Glows */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-30">
          <div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#E6C687]/5 blur-[120px] animate-pulse"
            style={{ animationDuration: '15s' }}
          />
          <div 
            className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[100px] animate-pulse"
            style={{ animationDuration: '12s', animationDelay: '2s' }}
          />
        </div>

        {/* Drifting Dust Particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/20 blur-[1px]"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
                animation: `float-dust-${i} ${Math.random() * 20 + 20}s linear infinite`,
                animationDelay: `${-Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        <style>{`
          ${[...Array(15)].map((_, i) => `
            @keyframes float-dust-${i} {
              0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
              10% { opacity: 0.3; }
              90% { opacity: 0.3; }
              100% { transform: translateY(-100vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(360deg); opacity: 0; }
            }
          `).join('\n')}
        `}</style>

        {/* Film Grain Layer */}
        <div className="absolute inset-0 z-[50] pointer-events-none opacity-[0.1] mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_scratches_transparent_overlay.png')]" />

        {/* Phase 0: The Singularity Pulse Screen */}
        <div 
          ref={loadingScreenRef}
          className="absolute inset-0 z-[100] opacity-0 pointer-events-none flex flex-col items-center justify-center bg-[#000] overflow-hidden"
        >
          <div className="singularity-container relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
            
            {/* Radial Light Streak System */}
            <div className="absolute inset-x-0 h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {[...Array(100)].map((_, i) => {
                const angle = (i / 100) * Math.PI * 2;
                return (
                  <div 
                    key={i} 
                    className="light-streak absolute bg-gradient-to-t from-[#E6C687] to-transparent w-[2px] h-[400px] opacity-0"
                    style={{ 
                      left: '50%',
                      top: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        rotate(${angle + Math.PI/2}rad) 
                        translateY(-400px) 
                        translateZ(${-i * 40}px)
                      `,
                      transformStyle: 'preserve-3d',
                      filter: 'blur(2px)'
                    }}
                  />
                );
              })}
            </div>

            {/* Central Logo & Progress */}
            <div className="relative z-50 flex flex-col items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
               <div className="mb-8 font-mono text-xs md:text-sm text-[#E6C687] opacity-40 tracking-[1em] uppercase">
                  Decryption In Progress... {progress}%
               </div>
               <h2 className="brand-logo-singularity font-display italic font-bold text-7xl md:text-[10rem] flex items-center justify-center select-none pointer-events-none">
                  {"JUNJUNMI".split('').map((char, i) => (
                    <span 
                      key={i} 
                      className="brand-char inline-block transition-all duration-700" 
                      style={{ 
                        opacity: progress / 100 > (i / 8) ? 1 : 0.1,
                        filter: progress / 100 > (i / 8) ? 'blur(0px)' : 'blur(10px)',
                        color: progress / 100 > (i / 8) ? '#FFFFFF' : '#333333',
                        textShadow: progress / 100 > (i / 8) ? '0 0 20px rgba(255,255,255,0.4)' : 'none',
                        transform: progress / 100 > (i / 8) ? 'scale(1)' : 'scale(0.8)',
                      }}
                    >
                      {char}
                    </span>
                  ))}
               </h2>
            </div>

            {/* Ambient Flare */}
            <div className="absolute inset-0 bg-radial-gradient from-[#E6C687]/10 via-transparent to-black pointer-events-none" />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-screen overflow-hidden">
          <LiquidBackground />
        </div>

        {/* Main UI Content (Achromatic Starfield Gate) */}
        <div 
          ref={contentRef}
          className="welcome-content relative z-10 flex flex-col items-center text-center select-none"
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          <div className="mb-8 flex items-center overflow-hidden h-4">
            <span className="block text-[#E6C687]/30 font-mono text-[9px] tracking-[0.8em] uppercase">
              System Initialize // Starfield.Active
            </span>
          </div>
          
          <h2 className="flex flex-col md:flex-row items-center justify-center mb-24 px-4 w-full">
            <span className="font-display font-light text-[0.85rem] tracking-[0.5em] text-white/20 uppercase text-center">
              Archive
            </span>
            <span className="hidden md:inline mx-10 text-[#E6C687] opacity-10 text-3xl font-thin">
              /
            </span>
            <div 
              ref={nameRef}
              className="relative inline-block font-display italic font-bold text-7xl md:text-[7.5rem] tracking-tight text-white mt-6 md:mt-0 select-none"
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 12px rgba(230, 198, 135, 0.4), 0 0 40px rgba(0, 0, 0, 0.8)',
                display: 'inline-block',
                padding: '10px 20px',
                overflow: 'visible'
              }}
            >
              {"JUNJUNMI".split('').map((char, i) => (
                i === 4 ? (
                  <PeekingGuardian key={i}>{char}</PeekingGuardian>
                ) : (
                  <span key={i} className="hover:text-[#E6C687] transition-all duration-500">{char}</span>
                )
              ))}
            </div>
          </h2>

          <button
            id="enter-btn"
            onClick={handleEnter}
            className="group relative px-16 py-5 mt-8 overflow-hidden transition-all duration-500"
            style={{
              color: '#E6C687',
              background: 'none',
              border: 'none',
              fontFamily: 'serif',
              letterSpacing: '0.6em',
              fontSize: '11px',
              cursor: 'pointer',
              zIndex: 99,
              opacity: 1,
            }}
          >
            <div className="absolute inset-0 border border-[#E6C687]/20 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-[#E6C687]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
            <span className="relative z-10 group-hover:tracking-[1.2em] transition-all duration-700 uppercase">
              Enter The Archive
            </span>
          </button>

          <div className="mt-40 space-y-4 opacity-10">
            <div className="w-px h-20 bg-gradient-to-b from-[#E6C687]/0 to-[#E6C687]/40 mx-auto" />
            <div className="text-[9px] font-mono tracking-[0.5em] text-[#E6C687] uppercase">
              Protocol v1.2.0 // Gothic.Obsidian
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
