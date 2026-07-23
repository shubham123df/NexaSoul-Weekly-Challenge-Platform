import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const allOrbs = [
  { size: 500, x: '5%', y: '10%', color: 'rgba(37, 99, 235, 0.15)', delay: 0, duration: 20 },
  { size: 400, x: '85%', y: '75%', color: 'rgba(6, 182, 212, 0.12)', delay: 2, duration: 22 },
  { size: 350, x: '45%', y: '5%', color: 'rgba(139, 92, 246, 0.10)', delay: 4, duration: 24 },
  { size: 380, x: '15%', y: '85%', color: 'rgba(16, 185, 129, 0.10)', delay: 1, duration: 21 },
  { size: 320, x: '80%', y: '20%', color: 'rgba(37, 99, 235, 0.12)', delay: 3, duration: 23 },
  { size: 280, x: '40%', y: '55%', color: 'rgba(6, 182, 212, 0.09)', delay: 5, duration: 25 },
  { size: 250, x: '60%', y: '90%', color: 'rgba(139, 92, 246, 0.10)', delay: 6, duration: 26 },
  { size: 200, x: '25%', y: '40%', color: 'rgba(236, 72, 153, 0.08)', delay: 7, duration: 27 },
  { size: 180, x: '70%', y: '35%', color: 'rgba(251, 146, 60, 0.07)', delay: 8, duration: 28 },
];

const mobileOrbIndices = [0, 1, 4, 6];

export default function AnimatedBackground() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const orbs = isMobile ? mobileOrbIndices.map((i) => allOrbs[i]) : allOrbs;
  const shouldAnimate = !reducedMotion && !isMobile;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`bg-orb blur-3xl ${shouldAnimate ? 'bg-orb-animate' : ''}`}
          style={{
            width: isMobile ? orb.size * 0.6 : orb.size,
            height: isMobile ? orb.size * 0.6 : orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
            '--orb-duration': `${orb.duration}s`,
            '--orb-delay': `${orb.delay}s`,
            opacity: isMobile ? 0.4 : 0.6,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.4) 1.5px, transparent 1.5px)',
          backgroundSize: isMobile ? '32px 32px' : '40px 40px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-50/40 to-background-100/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent-cyan/5 pointer-events-none" />

      {!isMobile && (
        <>
          <div
            className={`absolute inset-0 opacity-[0.03] ${shouldAnimate ? 'bg-mesh-animate' : ''}`}
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(6,182,212,0.1) 50%, rgba(139,92,246,0.1) 100%)',
              backgroundSize: '400% 400%',
            }}
          />
          <div
            className={`bg-orb top-1/4 left-1/4 w-[600px] h-[600px] blur-[150px] bg-primary/8 ${shouldAnimate ? 'bg-orb-animate' : ''}`}
            style={{ '--orb-duration': '25s', '--orb-delay': '0s' }}
          />
          <div
            className={`bg-orb bottom-1/4 right-1/4 w-[500px] h-[500px] blur-[120px] bg-accent-cyan/6 ${shouldAnimate ? 'bg-orb-animate' : ''}`}
            style={{ '--orb-duration': '28s', '--orb-delay': '2s' }}
          />
        </>
      )}
    </div>
  );
}
