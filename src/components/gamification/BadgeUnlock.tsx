import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { useEffect } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';

export default function BadgeUnlock() {
  const { showBadgeUnlock, lastBadge, dismissBadgeUnlock } = useGamificationStore();

  useEffect(() => {
    if (showBadgeUnlock) {
      const timer = setTimeout(dismissBadgeUnlock, 3000);
      return () => clearTimeout(timer);
    }
  }, [showBadgeUnlock, dismissBadgeUnlock]);

  return (
    <AnimatePresence>
      {showBadgeUnlock && lastBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={dismissBadgeUnlock}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-gradient-to-br from-brand-yellow to-yellow-600 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-[280px]"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Award size={64} className="text-brand-dark" />
            </motion.div>
            <h3 className="text-brand-dark font-extrabold text-xl text-center">
              Badge Desbloqueado!
            </h3>
            <p className="text-brand-dark/80 font-semibold text-center">
              {lastBadge.name}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
