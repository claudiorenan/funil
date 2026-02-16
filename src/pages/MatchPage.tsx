import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PsychologistCard from '../components/match/PsychologistCard';
import HowItWorks from '../components/match/HowItWorks';
import { psychologists } from '../data/psychologists';

const EXTERNAL_URL = 'https://cademeupsi.com.br/psicologos';

export default function MatchPage() {
  const navigate = useNavigate();

  const handleSelect = (_id: string) => {
    window.open(EXTERNAL_URL, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-whatsapp-dark">
      {/* Header */}
      <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3 shrink-0">
        <button onClick={() => navigate('/triagem')} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-base">Profissionais para você</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 px-4"
        >
          <Sparkles size={40} className="text-brand-yellow mx-auto mb-3" />
          <h2 className="text-white font-extrabold text-xl mb-2">
            Encontramos profissionais ideais para você!
          </h2>
          <p className="text-gray-400 text-sm">
            Baseado no seu perfil, selecionamos psicólogos com experiência no que você precisa.
          </p>
        </motion.div>

        <HowItWorks />

        <div className="py-4">
          <h3 className="text-white font-bold text-center mb-4 px-4">
            Profissionais recomendados 💚
          </h3>
          {psychologists.map((psi, i) => (
            <PsychologistCard
              key={psi.id}
              psychologist={psi}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="px-4 pb-8">
          <a
            href={EXTERNAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded-full text-sm text-center active:scale-[0.98] transition-transform"
          >
            Quero escolher meu psicólogo ✨
          </a>
        </div>
      </div>
    </div>
  );
}
