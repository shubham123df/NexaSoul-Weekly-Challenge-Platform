import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const labels = ['A', 'B', 'C', 'D'];

export default function OptionButton({ index, text, selected, onSelect, disabled, variant = 'default' }) {
  const isEdu = variant === 'edu';

  if (isEdu) {
    return (
      <motion.button
        initial={false}
        animate={selected ? { scale: 1.02 } : { scale: 1 }}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={() => !disabled && onSelect(index)}
        disabled={disabled}
        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
          selected
            ? 'border-primary bg-gradient-to-r from-primary/20 to-accent-cyan/20 shadow-xl shadow-primary/40'
            : 'border-primary/30 bg-white hover:border-primary hover:bg-primary/10'
        } ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Background glow effect for selected */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-cyan/10"
          />
        )}

        <motion.span
          animate={selected ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 transition-all duration-300 relative z-10 ${
            selected
              ? 'bg-gradient-to-br from-primary to-accent-cyan text-white shadow-lg shadow-primary/30'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-primary/40 text-black'
          }`}
        >
          {selected ? <Check className="w-6 h-6" /> : labels[index]}
        </motion.span>

        <span className={`text-base sm:text-lg flex-1 relative z-10 transition-colors duration-300 ${
          selected ? 'font-bold text-black' : 'font-semibold text-black'
        }`}>
          {text}
        </span>

        {/* Selection indicator dot */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-3 h-3 rounded-full bg-accent-lime shadow-glow"
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={false}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${
        selected
          ? 'border-primary bg-gradient-to-r from-primary/15 to-accent-yellow/10 shadow-lg shadow-primary/25'
          : 'border-border bg-surface hover:border-accent-lime/40 hover:bg-accent-lime/5'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!disabled && !selected && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      <motion.span
        animate={selected ? { scale: 1.1 } : { scale: 1 }}
        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${
          selected ? 'bg-gradient-primary text-white shadow-glow' : 'bg-surface text-text-100 group-hover:text-text group-hover:bg-primary/20'
        }`}
      >
        {labels[index]}
      </motion.span>
      <span className={`text-sm sm:text-base relative z-10 ${selected ? 'font-semibold text-text' : 'text-text-100'}`}>
        {text}
      </span>

      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-lime shadow-glow"
        />
      )}
    </motion.button>
  );
}
