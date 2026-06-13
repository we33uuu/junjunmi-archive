import { useState, useRef, useEffect } from 'react';

/**
 * 全屏视频背景组件
 * - SVG 噪点遮罩 → 打破视频压缩产生的马赛克色块 / 色彩断层
 * - 加载检测 + 淡入 → 避免首帧解码延迟导致的视觉闪烁
 * - object-fit: cover → 完美铺满
 */
export default function VideoBackground({
  src,
  poster,
  noiseOpacity = 0.04,
}: {
  src: string;
  poster?: string;
  noiseOpacity?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ── 策略：等视频真正流畅后再淡入 ──
    const handleReady = () => {
      // canplaythrough = 浏览器预估能无卡顿播完
      // 再额外延迟 200ms，确保初帧已渲染到 GPU
      setTimeout(() => setReady(true), 200);
    };

    // 如果视频已在缓存中（例如之前加载过），立即检查
    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener('canplaythrough', handleReady);
    }

    return () => {
      video.removeEventListener('canplaythrough', handleReady);
    };
  }, [src]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* ─── 第 1 层：视频 ─── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ─── 第 2 层：SVG 噪点遮罩（核心） ───
           用 feTurbulence 生成胶片质感噪点，打破视频压缩的
           马赛克大色块和色彩断层，同时增添电影感。
           pointer-events: none 保证不挡住下方文字点击 */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ opacity: noiseOpacity, zIndex: 1 }}
        aria-hidden="true"
      >
        {/* 双层噪点叠加：一层粗粒（打破大色块）+ 一层细粒（打破断层线） */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="vn-coarse">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="vn-fine">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.5"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          {/* 粗粒层 */}
          <rect width="100%" height="100%" filter="url(#vn-coarse)" opacity="0.6" />
          {/* 细粒层 */}
          <rect width="100%" height="100%" filter="url(#vn-fine)" opacity="0.4" />
        </svg>
      </div>

      {/* ─── 第 3 层：边缘暗角（可选，增强电影感） ─── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
