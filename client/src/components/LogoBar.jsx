export default function LogoBar({ className = '', size = 'md' }) {
  const isLarge = size === 'lg';

  return (
    <div
      className={`group inline-flex min-w-0 max-w-full items-center gap-3 sm:gap-8 px-4 sm:px-8 py-3 sm:py-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
    >
      {/* Soft theme shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent-cyan/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* NexaSoul logo — original PNG, non-clickable */}
      <div className="relative flex items-center justify-center">
        <img
          src="/nexasoul-logo-full.png"
          alt="NexaSoul"
          className={`w-auto max-w-full object-contain ${isLarge ? 'h-12 sm:h-20' : 'h-10 sm:h-16'}`}
        />
      </div>

      {/* Divider */}
      <span className="w-px bg-gradient-to-b from-transparent via-border/50 to-transparent hidden sm:block" style={{ height: isLarge ? '48px' : '36px' }} />

      {/* Srujana badge */}
      <div className={`relative flex shrink-0 items-center gap-1 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5 rounded-xl bg-primary/10 border border-primary/20 max-[380px]:hidden ${isLarge ? 'sm:scale-125 origin-center' : 'sm:scale-110 origin-center'}`}>
        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
        <span className="text-sm sm:text-base font-bold text-primary">Srujana</span>
      </div>

      {/* Divider */}
      <span className="w-px bg-gradient-to-b from-transparent via-border/50 to-transparent hidden sm:block" style={{ height: isLarge ? '48px' : '36px' }} />

      {/* CU logo — original PNG, non-clickable, no white background, theme-matched */}
      <div className="relative flex items-center justify-center rounded-lg">
        <img
          src="/cu-logo-full.png"
          alt="Chandigarh University"
          className={`w-auto max-w-full object-contain ${isLarge ? 'h-10 sm:h-18' : 'h-8 sm:h-14'}`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.15))',
          }}
        />
      </div>
    </div>
  );
}
