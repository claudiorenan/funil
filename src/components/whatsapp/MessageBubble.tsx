import { motion } from 'framer-motion';
import type { ChatMessage } from '../../types';
import ReadReceipts from './ReadReceipts';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isLead = message.sender === 'lead';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex ${isLead ? 'justify-end' : 'justify-start'} mb-1`}
    >
      <div
        className={`relative max-w-[80%] px-3 py-1.5 rounded-lg text-sm leading-relaxed ${
          isLead
            ? 'bg-whatsapp-outgoing text-white rounded-tr-none'
            : 'bg-[#202C33] text-gray-100 rounded-tl-none'
        }`}
      >
        {/* Tail */}
        <div
          className={`absolute top-0 w-2 h-2 ${
            isLead
              ? 'right-[-6px] border-l-8 border-l-whatsapp-outgoing border-t-0 border-b-8 border-b-transparent border-r-0'
              : 'left-[-6px] border-r-8 border-r-[#202C33] border-t-0 border-b-8 border-b-transparent border-l-0'
          }`}
          style={{ borderStyle: 'solid', width: 0, height: 0 }}
        />
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className={`flex items-center gap-1 mt-0.5 ${isLead ? 'justify-end' : 'justify-end'}`}>
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
          {isLead && <ReadReceipts status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}
