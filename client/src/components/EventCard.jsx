import { motion } from 'framer-motion';

export default function EventCard({ icon: Icon, title, description, details, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="group glass-card p-6 sm:p-7 relative overflow-hidden cursor-default hover-lift card-shine"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 224, 255, 0.3), rgba(57, 255, 20, 0.3))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Glow orb behind icon */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-accent-green/15 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300 group-hover:rotate-3">
          <Icon className="w-6 h-6 text-primary group-hover:text-accent-green transition-colors duration-300" />
        </div>

        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-gradient transition-all duration-300">{title}</h3>
        <p className="text-text-100 text-sm leading-relaxed mb-4">{description}</p>

        <p className="text-text-100 text-sm border-t border-border pt-3">
          {details}
        </p>
      </div>
    </motion.div>
  );
}
