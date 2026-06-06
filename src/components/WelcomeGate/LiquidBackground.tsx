import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  dx: number;
  dy: number;
}

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      twinkleSpeed: Math.random() * 0.05 + 0.02,
      phase: Math.random() * Math.PI * 2
    }));

    let meteors: Meteor[] = [];

    const createMeteor = () => {
      const angle = Math.PI / 4.0; // Consistent elegant diagonal
      const speed = Math.random() * 18 + 14;
      
      // Broaden spawn range to ensure meteors appear across all quadrants
      // (Spawning further "back" along the trajectory to cross the bottom-left)
      const x = Math.random() * (width * 1.5) - (width * 0.5);
      const y = -300 + (Math.random() * 200);

      return {
        x,
        y,
        length: Math.random() * 300 + 200,
        speed: speed,
        opacity: 1,
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle)
      };
    };

    let animationFrameId: number;
    let lastMeteorTime = 0;

    const animate = (time: number) => {
      // Dark Obsidian Background
      ctx.fillStyle = '#050406';
      ctx.fillRect(0, 0, width, height);

      // Rendering Stars
      stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        const opacity = 0.4 + (Math.sin(star.phase) + 1) * 0.4;
        ctx.fillStyle = `rgba(230, 210, 160, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn Meteors - More frequent
      if (time - lastMeteorTime > Math.random() * 800 + 400 && meteors.length < 8) {
        meteors.push(createMeteor());
        lastMeteorTime = time;
      }

      // Update & Render Meteors
      meteors = meteors.filter(m => {
        m.x += m.dx;
        m.y += m.dy;
        m.opacity -= 0.007;

        if (m.opacity <= 0 || m.y > height + 400) return false;

        const grad = ctx.createLinearGradient(
          m.x, m.y, 
          m.x - m.dx * (m.length / m.speed), 
          m.y - m.dy * (m.length / m.speed)
        );
        grad.addColorStop(0, `rgba(230, 210, 160, ${m.opacity})`);
        grad.addColorStop(0.2, `rgba(230, 210, 160, ${m.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5; 
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x - m.dx * (m.length / m.speed), 
          m.y - m.dy * (m.length / m.speed)
        );
        ctx.stroke();

        // High-end glow at meteor head
        ctx.fillStyle = `rgba(230, 210, 160, ${m.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Reposition stars on resize
      stars.forEach(s => {
        s.x = Math.random() * width;
        s.y = Math.random() * height;
      });
    };

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
