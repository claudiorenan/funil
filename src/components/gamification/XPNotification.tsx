import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';

export default function XPNotification() {
  const { showXPNotification, lastXPGain, dismissXPNotification } = useGamificationStore();

  useEffect(() => {
    if (showXPNotification) {
      const timer = setTimeout(dismissXPNotification, 2000);
      return () => clearTimeout(timer);
    }
  }, [showXPNotification, dismissXPNotification]);

  return (
    <AnimatePresence>
      {showXPNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-brand-yellow text-brand-dark px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
        >
          <Star size={16} className="fill-brand-dark" />
          +{lastXPGain} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
