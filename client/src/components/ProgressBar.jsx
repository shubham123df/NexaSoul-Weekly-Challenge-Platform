import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, variant = 'default' }) {
  const percent = total ? (current / total) * 100 : 0;
  const isEdu = variant === 'edu';

  return (
    <div className="w-full">
      <div className={`flex justify-between text-xs mb-2 ${isEdu ? 'text-text-100' : 'text-text-100'}`}>
        <span>Question {current} of {total}</span>
        <span className={isEdu ? 'font-semibold text-primary' : ''}>{Math.round(percent)}%</span>
      </div>
      <div className={`h-2.5 rounded-full overflow-hidden ${isEdu ? 'bg-border' : 'bg-border'}`}>
        <motion.div
          className={`h-full rounded-full ${isEdu ? 'bg-gradient-to-r from-primary to-accent-yellow' : 'bg-gradient-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
