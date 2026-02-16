import { motion } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import type { Psychologist } from '../../types';

interface PsychologistCardProps {
  psychologist: Psychologist;
  index: number;
  onSelect: (id: string) => void;
}

export default function PsychologistCard({ psychologist, index, onSelect }: PsychologistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.2, type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-[#202C33] rounded-2xl overflow-hidden mx-4 mb-4"
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-16 h-16 rounded-full bg-gray-600 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={psychologist.photo}
              alt={psychologist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  `<span class="text-white text-xl font-bold">${psychologist.name[0]}</span>`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base">{psychologist.name}</h3>
            <p className="text-whatsapp-green text-sm font-medium">{psychologist.specialty}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-brand-yellow fill-brand-yellow" />
              <span className="text-brand-yellow text-xs font-semibold">{psychologist.rating}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{psychologist.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {psychologist.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-whatsapp-green/10 text-whatsapp-green text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{psychologist.availability}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>Online</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-brand-yellow font-bold text-sm">{psychologist.priceRange}</span>
          <button
            onClick={() => onSelect(psychologist.id)}
            className="bg-whatsapp-green text-white font-semibold text-sm px-5 py-2 rounded-full active:scale-95 transition-transform"
          >
            Agendar sessão
          </button>
        </div>
      </div>
    </motion.div>
  );
}
