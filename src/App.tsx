import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import Cube from './components/Cube/Cube';
import Gallery from './components/Gallery/Gallery';
import Finale from './components/Finale/Finale';
import WelcomeGate from './components/WelcomeGate/WelcomeGate';
import { AppPhase } from './types';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.WELCOME);
  const [isZooming, setIsZooming] = useState(false);
  const [showGalleryTrack, setShowGalleryTrack] = useState(false);

  useEffect(() => {
    const handleGlobalTransition = (e: any) => {
      console.log("Global Transition Triggered:", e.detail);
      handleFaceClick(e.detail);
    };
    window.addEventListener('start-transition', handleGlobalTransition);
    return () => window.removeEventListener('start-transition', handleGlobalTransition);
  }, []);

  const handleFaceClick = (index: number) => {
    if (isZooming) return;
    setIsZooming(true);
    
    // Smooth transition to Phase 2 (Gallery)
    setTimeout(() => {
      setPhase(AppPhase.GALLERY);
      // We keep isZooming true for a very short moment in the new phase 
      // to let the SingularityIris exit reveal the gallery
      setTimeout(() => {
        setIsZooming(false);
      }, 300);
      setShowGalleryTrack(true);
    }, 1200);
  };

  const SingularityIris = () => (
    <Motion.div 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 5 }}
      exit={{ opacity: 0, scale: 10 }}
      transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-black pointer-events-none flex items-center justify-center"
    >
       <div className="w-[1px] h-full bg-[#E6C687]/20 blur-md" />
       <div className="absolute w-full h-[1px] bg-[#E6C687]/20 blur-md" />
       <div className="absolute w-40 h-40 border border-[#E6C687]/10 rounded-full blur-xl animate-pulse" />
    </Motion.div>
  );

  const handleFinale = () => {
    setPhase(AppPhase.FINALE);
  };

  const handleReset = () => {
    setPhase(AppPhase.WELCOME);
    setIsZooming(false);
    setShowGalleryTrack(false);
  };

  const handleEnterGate = () => {
    setPhase(AppPhase.CUBE);
  };

  return (
    <main className={`relative w-full h-screen ${phase === AppPhase.FINALE ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'} font-sans selection:bg-white/20 transition-colors duration-[3000ms] bg-black`}
    >
      <AnimatePresence>
        {isZooming && <SingularityIris key="iris" />}
      </AnimatePresence>
      <AnimatePresence>
        {phase === AppPhase.WELCOME && (
          <Motion.div 
            key="welcome-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 5.0, ease: 'linear' }}
          >
            <WelcomeGate onEnter={handleEnterGate} />
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-[3000ms] ${phase === AppPhase.FINALE ? 'opacity-40' : 'opacity-100'} bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,transparent_70%)]`} />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <AnimatePresence>
        {phase === AppPhase.CUBE && (
          <Motion.div
            key="cube-phase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 3, opacity: 0, filter: 'blur(60px)' }}
            transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            className="w-full h-full flex flex-col"
          >
            {/* Top HUD */}
            <nav className="absolute top-0 w-full p-8 md:p-12 flex justify-between items-start z-50 pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1 font-mono">Project // Genesis</span>
                <span className="text-2xl md:text-3xl font-light tracking-tighter italic font-serif">Obsidian Labyrinth</span>
                
                <Motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="max-w-xs text-[10px] md:text-xs leading-relaxed opacity-30 font-serif italic mt-6"
                >
                  "The transition from geometry to infinity begins with a single rotation. Drag to explore the structure of our shared memories."
                </Motion.p>
              </div>
              <div className="flex space-x-12 hidden md:flex">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-mono">Current State</span>
                  <span className="text-xs font-mono text-gold">PHASE_01:CUBE_STASIS</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-mono">Temporal Seed</span>
                  <span className="text-xs font-mono">2026.06.05 // 12:39</span>
                </div>
              </div>
            </nav>

            <Cube onFaceClick={handleFaceClick} isZooming={isZooming} />
            
            {/* Bottom HUD - Trimmed */}
            <div className="absolute bottom-12 w-full px-8 md:px-12 flex justify-between items-end z-50 pointer-events-none">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-1 h-3 bg-gold animate-pulse" />
                </div>
                <span className="text-[9px] tracking-[0.3em] uppercase opacity-60 font-mono">Interaction Active</span>
              </div>

              <div className="text-right hidden sm:block">
                <span className="block text-5xl font-thin tracking-tighter opacity-10 leading-none">01</span>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-mono">Structural Integrity: 99.8%</span>
              </div>
            </div>
          </Motion.div>
        )}

        {phase === AppPhase.GALLERY && (
          <Motion.div
            key="gallery-phase"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full relative"
          >
            <Gallery onFinale={handleFinale} />
          </Motion.div>
        )}

        {phase === AppPhase.FINALE && (
          <Motion.div
            key="finale-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full pointer-events-none"
          >
            <div className="w-full h-full pointer-events-auto">
              <Finale onReset={handleReset} />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      
      {/* Cinematic Vignette Overlay - Using pointer-events-none to ensure it doesn't block clicks */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.7)_100%)] z-[60]" />
      
      {/* Dynamic Cursor Light (Simulated) */}
      <Motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-gold/5 blur-[100px] pointer-events-none z-0"
        style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </main>
  );
}
