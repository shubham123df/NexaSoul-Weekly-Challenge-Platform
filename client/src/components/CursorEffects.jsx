import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorEffects() {
  const [clicks, setClicks] = useState([]);
  const [hoverEffects, setHoverEffects] = useState([]);
  const containerRef = useRef(null);

  const handleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newClick = {
      id: Date.now(),
      x,
      y,
      timestamp: Date.now(),
    };

    setClicks(prev => [...prev.slice(-5), newClick]);

    // Remove click after animation
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== newClick.id));
    }, 1500);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add hover effect occasionally
    if (Math.random() > 0.92) {
      const newHover = {
        id: Date.now() + Math.random(),
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        size: Math.random() * 30 + 20,
        timestamp: Date.now(),
      };

      setHoverEffects(prev => [...prev.slice(-8), newHover]);

      setTimeout(() => {
        setHoverEffects(prev => prev.filter(h => h.id !== newHover.id));
      }, 2000);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('click', handleClick);
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Click ripple effects */}
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: click.x,
            top: click.y,
            width: 0,
            height: 0,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 70%)',
            filter: 'blur(0px)',
            transformOrigin: 'center',
            marginLeft: '-150px',
            marginTop: '-150px',
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 4, 6],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Secondary click rings */}
      {clicks.map((click) => (
        <motion.div
          key={`ring-${click.id}`}
          className="absolute rounded-full border-2 border-primary/30 pointer-events-none"
          style={{
            left: click.x,
            top: click.y,
            width: 0,
            height: 0,
            transformOrigin: 'center',
            marginLeft: '-100px',
            marginTop: '-100px',
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{
            scale: [0, 3, 5],
            opacity: [0.6, 0.3, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            delay: 0.1,
          }}
        />
      ))}

      {/* Hover sparkle effects */}
      {hoverEffects.map((hover) => (
        <motion.div
          key={hover.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: hover.x,
            top: hover.y,
            width: hover.size,
            height: hover.size,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${Math.random() * 0.3 + 0.2}) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)`,
            filter: 'blur(2px)',
            marginLeft: `-${hover.size / 2}px`,
            marginTop: `-${hover.size / 2}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Ambient floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            background: `rgba(${37 + Math.random() * 50}, ${99 + Math.random() * 100}, ${235 + Math.random() * 20}, ${Math.random() * 0.15 + 0.05})`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Mouse follower glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: clicks.length > 0 ? clicks[clicks.length - 1].x - 100 : 0,
          y: clicks.length > 0 ? clicks[clicks.length - 1].y - 100 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 25,
        }}
      />
    </div>
  );
}
