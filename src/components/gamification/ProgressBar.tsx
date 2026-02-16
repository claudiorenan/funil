import { motion } from 'framer-motion';
import { useGamificationStore } from '../../stores/gamificationStore';

const TOTAL_STEPS = 7;

export default function ProgressBar() {
  const { currentStep, stepLabel } = useGamificationStore();

  if (currentStep === 0) return null;

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 bg-whatsapp-dark/80 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">
          Passo {currentStep} de {TOTAL_STEPS}
        </span>
        <span className="text-xs text-gray-300 font-medium">{stepLabel}</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-whatsapp-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
