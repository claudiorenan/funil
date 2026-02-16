import { motion, AnimatePresence } from 'framer-motion';

interface QuickRepliesProps {
  choices: string[];
  visible: boolean;
  onSelect: (choice: string) => void;
}

export default function QuickReplies({ choices, visible, onSelect }: QuickRepliesProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex flex-wrap gap-2 px-3 py-3"
        >
          {choices.map((choice, index) => (
            <motion.button
              key={choice}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelect(choice)}
              className="px-4 py-2 bg-whatsapp-outgoing text-white text-sm rounded-full border border-whatsapp-green/30 hover:bg-whatsapp-green/30 active:scale-95 transition-all cursor-pointer"
            >
              {choice}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
