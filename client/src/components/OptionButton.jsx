import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const labels = ['A', 'B', 'C', 'D'];

export default function OptionButton({ index, text, selected, onSelect, disabled, variant = 'default' }) {
  const isEdu = variant === 'edu';

  if (isEdu) {
    return (
      <motion.button
        initial={false}
        animate={selected ? { scale: 1.01 } : { scale: 1 }}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        onClick={() => !disabled && onSelect(index)}
        disabled={disabled}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
          selected
            ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
            : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
        } ${disabled && !selected ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
            selected
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {selected ? <Check className="w-5 h-5" /> : labels[index]}
        </span>
        <span className={`text-sm sm:text-base flex-1 ${selected ? 'font-medium text-slate-800' : 'text-slate-700'}`}>
          {text}
        </span>
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
          ? 'border-nexa-blue bg-gradient-to-r from-nexa-blue/15 to-nexa-green/10 shadow-lg shadow-nexa-blue/25'
          : 'border-nexa-border bg-nexa-card/50 hover:border-nexa-green/40 hover:bg-nexa-green/5'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!disabled && !selected && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      <motion.span
        animate={selected ? { scale: 1.1 } : { scale: 1 }}
        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${
          selected ? 'bg-nexa-gradient text-nexa-navy shadow-glow-blue' : 'bg-nexa-navy-soft text-nexa-muted group-hover:text-nexa-white group-hover:bg-nexa-blue/20'
        }`}
      >
        {labels[index]}
      </motion.span>
      <span className={`text-sm sm:text-base relative z-10 ${selected ? 'font-semibold text-nexa-white' : 'text-nexa-gray'}`}>
        {text}
      </span>

      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-nexa-green shadow-glow-green"
        />
      )}
    </motion.button>
  );
}
