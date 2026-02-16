import { useState } from 'react';
import { Smile, Paperclip, Camera, Mic, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  waitingForText?: boolean;
  placeholder?: string;
  onSubmit?: (text: string) => void;
}

export default function ChatInput({ waitingForText = false, placeholder = 'Mensagem', onSubmit }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || !onSubmit) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-whatsapp-dark shrink-0">
      <div className="flex-1 flex items-center gap-2 bg-whatsapp-input rounded-full px-4 py-2">
        <Smile size={20} className="text-gray-400 shrink-0" />
        {waitingForText ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
        ) : (
          <>
            <span className="text-gray-500 text-sm flex-1">Mensagem</span>
            <Paperclip size={20} className="text-gray-400 shrink-0" />
            <Camera size={20} className="text-gray-400 shrink-0" />
          </>
        )}
      </div>
      <AnimatePresence mode="wait">
        {waitingForText && value.trim() ? (
          <motion.button
            key="send"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleSubmit}
            className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Send size={18} className="text-white ml-0.5" />
          </motion.button>
        ) : (
          <motion.div
            key="mic"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center shrink-0"
          >
            <Mic size={20} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
