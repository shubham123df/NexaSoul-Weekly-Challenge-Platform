import { motion } from 'framer-motion';

const orbs = [
  { size: 280, x: '12%', y: '18%', color: 'rgba(0, 224, 255, 0.12)', delay: 0 },
  { size: 220, x: '78%', y: '65%', color: 'rgba(57, 255, 20, 0.08)', delay: 2 },
  { size: 160, x: '55%', y: '12%', color: 'rgba(0, 224, 255, 0.1)', delay: 4 },
  { size: 200, x: '22%', y: '78%', color: 'rgba(57, 255, 20, 0.07)', delay: 1 },
  { size: 120, x: '88%', y: '28%', color: 'rgba(6, 182, 212, 0.11)', delay: 3 },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 72%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.08, 0.97, 1],
            opacity: [0.6, 0.9, 0.6, 0.8],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Subtle grid dots */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
