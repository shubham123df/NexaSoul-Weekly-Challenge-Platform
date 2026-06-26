export default function LogoBar({ className = '', size = 'md' }) {
  const isLarge = size === 'lg';

  return (
    <div
      className={`group inline-flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(26, 58, 92, 0.8), rgba(36, 75, 110, 0.7))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 6px 28px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Soft theme shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/8 via-lime-400/8 to-cyan-400/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* NexaSoul logo — original PNG, non-clickable */}
      <div className="relative flex items-center justify-center">
        <img
          src="/nexasoul-logo-full.png"
          alt="NexaSoul"
          className={`w-auto object-contain ${isLarge ? 'h-9 sm:h-12' : 'h-7 sm:h-9'}`}
        />
      </div>

      {/* Divider */}
      <span className="w-px bg-gradient-to-b from-transparent via-white/25 to-transparent hidden sm:block" style={{ height: isLarge ? '28px' : '20px' }} />

      {/* Quiz badge */}
      <div className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 ${isLarge ? 'scale-110 origin-center' : ''}`}>
        <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
        <span className="text-xs sm:text-sm font-bold text-white">Quiz</span>
      </div>

      {/* Divider */}
      <span className="w-px bg-gradient-to-b from-transparent via-white/25 to-transparent hidden sm:block" style={{ height: isLarge ? '28px' : '20px' }} />

      {/* CU logo — original PNG, non-clickable, no white background, theme-matched */}
      <div className="relative flex items-center justify-center rounded-lg">
        <img
          src="/cu-logo-full.png"
          alt="Chandigarh University"
          className={`w-auto object-contain ${isLarge ? 'h-8 sm:h-11' : 'h-6 sm:h-8'}`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 224, 255, 0.25))',
          }}
        />
      </div>
    </div>
  );
}
