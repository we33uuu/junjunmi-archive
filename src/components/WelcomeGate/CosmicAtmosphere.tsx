import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const SHARD_COUNT = 8;
const DUST_COUNT = 40;
const LIGHT_RAY_COUNT = 3;

export const CosmicAtmosphere: React.FC = () => {
  const elements = useMemo(() => ({
    shards: Array.from({ length: SHARD_COUNT }).map((_, i) => ({
      id: `shard-${i}`,
      size: Math.random() * 80 + 40,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 40 + 40,
      rotation: Math.random() * 360,
      delay: Math.random() * -40,
    })),
    dust: Array.from({ length: DUST_COUNT }).map((_, i) => ({
      id: `dust-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -15,
    })),
    rays: Array.from({ length: LIGHT_RAY_COUNT }).map((_, i) => ({
      id: `ray-${i}`,
      x: Math.random() * 40 + 30,
      width: Math.random() * 300 + 200,
      angle: -15 + Math.random() * 10,
      duration: Math.random() * 10 + 10,
      delay: i * 3
    }))
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 1. 呼吸感深层星云 - 增加色彩层次感 */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-20%] bg-[radial-gradient(circle_at_40%_30%,rgba(230,198,135,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(96,56,43,0.04)_0%,transparent_60%)] blur-[80px]"
      />

      {/* 2. 唯美的创世光束 (God Rays) */}
      {elements.rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-[-20%] h-[140%] bg-gradient-to-b from-transparent via-[#E6C687]/[0.03] to-transparent blur-[60px]"
          style={{
            left: `${ray.x}%`,
            width: ray.width,
            transform: `rotate(${ray.angle}deg)`,
          }}
          animate={{ opacity: [0, 0.4, 0], x: [`${ray.x}%`, `${ray.x + 5}%`] }}
          transition={{ duration: ray.duration, repeat: Infinity, ease: "easeInOut", delay: ray.delay }}
        />
      ))}

      {/* 3. 类似余烬的慢速漂浮星尘 */}
      {elements.dust.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-[#E6C687]/40 shadow-[0_0_2px_#E6C687]"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.sin(d.duration) * 30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{ duration: d.duration, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}

      {/* 4. 折射感黑曜石棱镜 (Refractive Shards) */}
      {elements.shards.map((shard) => (
        <motion.div
          key={shard.id}
          className="absolute"
          style={{
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            width: shard.size,
            height: shard.size,
          }}
          animate={{ 
            rotate: shard.rotation + 360,
            y: [0, -40, 0],
            opacity: [0, 0.1, 0]
          }}
          transition={{ duration: shard.duration, repeat: Infinity, ease: "linear", delay: shard.delay }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E6C687]/10">
            <defs>
              <linearGradient id={`grad-${shard.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(230,198,135,0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path 
              d="M30 10 L80 20 L90 80 L20 90 Z" 
              fill={`url(#grad-${shard.id})`}
              stroke="rgba(230, 198, 135, 0.05)" 
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}
      {/* 5. 极细金色流星 - 提升存在感 */}
      <ShootingStar delay={2} top="15%" />
      <ShootingStar delay={8} top="35%" />
      <ShootingStar delay={14} top="10%" />
      <ShootingStar delay={20} top="25%" />
    </div>
  );
};

const ShootingStar: React.FC<{ delay: number; top: string }> = ({ delay, top }) => (
  <motion.div
    initial={{ x: "-20%", y: top, opacity: 0, scaleX: 0 }}
    animate={{ 
      x: ["0%", "200%"],
      y: [top, `${parseFloat(top) + 25}%`],
      opacity: [0, 1, 1, 0],
      scaleX: [0, 1.8, 1.8, 0]
    }}
    transition={{ 
      duration: 0.7, 
      repeat: Infinity, 
      repeatDelay: Math.random() * 4 + 2,
      delay,
      ease: [0.4, 0, 0.2, 1]
    }}
    className="absolute left-0 w-96 h-[3px] origin-left -rotate-[15deg] pointer-events-none mix-blend-screen"
  >
    {/* 核心光点 - 彗星头 (极亮) */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_6px_#E6C687,0_0_40px_10px_rgba(255,255,255,0.9)]" />
    
    {/* 强化的核心拖尾 */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E6C687] to-white" />
    
    {/* 外部动态泛光 */}
    <div className="absolute inset-x-0 -inset-y-2 blur-[6px] bg-gradient-to-r from-transparent via-[#E6C687]/60 to-white/40" />
    
    {/* 极细闪烁线 */}
    <div className="absolute inset-0 h-[1px] top-1/2 -translate-y-1/2 bg-white/80 shadow-[0_0_10px_#FFF]" />
  </motion.div>
);
