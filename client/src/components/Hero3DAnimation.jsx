import { useEffect, useRef } from 'react';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery';

export default function Hero3DAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let lastTime = 0;
    let isVisible = true;
    let documentVisible = !document.hidden;
    let cubeAngle = 0;
    let time = 0;

    function resize() {
      const mobile = window.innerWidth < 768;
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function projectIsometric(x, y, z, cx, cy) {
      const cosY = Math.cos(cubeAngle);
      const sinY = Math.sin(cubeAngle);
      const rx = x * cosY - z * sinY;
      const rz = z * cosY + x * sinY;
      const isoX = rx;
      const isoY = y * 0.88 - rz * 0.45;
      return { x: cx + isoX, y: cy + isoY };
    }

    function drawFrame(timestamp) {
      if (!isVisible || !documentVisible) {
        animationFrameId = 0;
        return;
      }

      const mobile = width < 768;
      const currentFPS = mobile ? 20 : 60;
      const frameInterval = 1000 / currentFPS;

      if (timestamp - lastTime < frameInterval) {
        animationFrameId = requestAnimationFrame(drawFrame);
        return;
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);
      cubeAngle -= mobile ? 0.003 : 0.006;
      time += mobile ? 0.008 : 0.015;

      const floatY = Math.sin(time) * (mobile ? 6 : 12);
      const cx = width / 2;
      const cy = height / 2 + floatY;

      const minDimension = Math.min(width, height);
      const isTablet = width >= 768 && width < 1024;
      let sizeMultiplier = 0.5;
      if (mobile) sizeMultiplier = 0.35;
      else if (isTablet) sizeMultiplier = 0.45;
      const size = Math.max(Math.min(minDimension * sizeMultiplier, mobile ? 140 : 250), mobile ? 60 : 100);

      const vertices = [
        { x: -size, y: -size, z: -size }, { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size }, { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size }, { x: size, y: -size, z: size },
        { x: size, y: size, z: size }, { x: -size, y: size, z: size },
      ];

      const projectedCube = vertices.map((v) => projectIsometric(v.x, v.y, v.z, cx, cy));

      const faces = [
        { verts: [0, 1, 5, 4], tint: 'rgba(30, 64, 175, 0.12)' },
        { verts: [1, 2, 6, 5], tint: 'rgba(30, 64, 175, 0.18)' },
        { verts: [3, 0, 4, 7], tint: 'rgba(30, 64, 175, 0.18)' },
      ];

      faces.forEach((face) => {
        const pts = face.verts.map((i) => projectedCube[i]);
        ctx.fillStyle = face.tint;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.fill();
      });

      const edgeConnections = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
      ctx.lineWidth = 1;
      edgeConnections.forEach((edge) => {
        const p1 = projectedCube[edge[0]];
        const p2 = projectedCube[edge[1]];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(drawFrame);
    }

    resize();
    animationFrameId = requestAnimationFrame(drawFrame);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && documentVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(drawFrame);
        }
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible && isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isMobile, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent-cyan/5" />
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="orb-1 absolute rounded-full opacity-45 pointer-events-none"
          style={{
            filter: isMobile ? 'blur(50px)' : 'blur(70px)',
            width: isMobile ? '40vw' : '35vw',
            height: isMobile ? '40vw' : '35vw',
            maxWidth: '280px',
            maxHeight: '280px',
            top: '-10%',
            left: '5%',
            background: 'radial-gradient(circle at 30% 30%, #bcd6fb, transparent 70%)',
            animation: isMobile ? 'none' : 'orbDrift1 22s ease-in-out infinite',
          }}
        />
        <div
          className="orb-2 absolute rounded-full opacity-45 pointer-events-none"
          style={{
            filter: isMobile ? 'blur(50px)' : 'blur(70px)',
            width: isMobile ? '35vw' : '30vw',
            height: isMobile ? '35vw' : '30vw',
            maxWidth: '240px',
            maxHeight: '240px',
            top: '10%',
            right: '3%',
            background: 'radial-gradient(circle at 60% 40%, #cfe0fd, transparent 70%)',
            animation: isMobile ? 'none' : 'orbDrift2 26s ease-in-out infinite',
          }}
        />
        <div
          className="ground-glow absolute pointer-events-none"
          style={{
            left: '50%',
            bottom: isMobile ? '-50px' : '-100px',
            width: '100%',
            maxWidth: '1500px',
            height: isMobile ? '250px' : '380px',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(48,115,240,0.30) 0%, rgba(48,115,240,0.10) 45%, transparent 75%)',
            animation: isMobile ? 'none' : 'groundBreathe 8s ease-in-out infinite',
          }}
        />
        {!isMobile && (
          <div
            className="ground-grid absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none"
            style={{ height: '100%', perspective: '200px', opacity: 0.7 }}
          >
            <div
              className="ground-grid-inner absolute"
              style={{
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                height: '200%',
                backgroundImage: 'linear-gradient(rgba(30, 64, 175, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                transform: 'rotateX(75deg)',
                transformOrigin: 'bottom center',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 80%)',
                maskImage: 'linear-gradient(to top, black 0%, transparent 80%)',
                animation: 'gridDrift 10s linear infinite',
              }}
            />
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none"
      />

      <style>{`
        @keyframes orbDrift1 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(20px,15px,0) scale(1.06); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-15px,20px,0) scale(1.08); }
        }
        @keyframes groundBreathe {
          0%,100% { opacity: 0.8; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 1; transform: translateX(-50%) scaleX(1.05); }
        }
        @keyframes gridDrift {
          from { background-position: 0 0; }
          to { background-position: 0 100px; }
        }
      `}</style>
    </>
  );
}
