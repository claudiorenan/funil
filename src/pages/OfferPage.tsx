import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, BookOpen, Heart, CheckCircle, MessageCircle } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';

const EXTERNAL_URL = 'https://cademeupsi.com.br/psicologos';

export default function OfferPage() {
  const navigate = useNavigate();
  const { selectedChoices } = useChatStore();
  const nome = selectedChoices.nome || 'Você';

  const benefits = [
    { icon: <BookOpen size={18} />, text: 'Ebooks exclusivos de saúde mental e emocional' },
    { icon: <MessageCircle size={18} />, text: 'Uma sessão de terapia inclusa' },
    { icon: <CheckCircle size={18} />, text: 'Psicólogo escolhido para o seu perfil' },
    { icon: <Heart size={18} />, text: 'Conteúdo para cuidar de você todos os dias' },
  ];

  return (
    <div className="flex flex-col h-full bg-whatsapp-dark">
      {/* Header */}
      <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3 shrink-0">
        <button onClick={() => navigate('/match')} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-base">Seu presente especial</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-brand-yellow to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen size={40} className="text-brand-dark" />
          </motion.div>
          <h2 className="text-white font-extrabold text-2xl mb-2">
            {nome}, preparamos algo especial para você!
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Você vai receber ebooks exclusivos para cuidar da sua saúde mental e emocional, com uma sessão de terapia inclusa.
          </p>
        </motion.div>

        {/* Benefits Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 bg-gradient-to-br from-whatsapp-outgoing to-[#004d40] rounded-2xl p-6 mb-6"
        >
          <p className="text-green-200 text-xs uppercase tracking-wider mb-3">O que você vai receber</p>

          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-white text-sm"
              >
                <span className="text-brand-yellow shrink-0">{b.icon}</span>
                {b.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-6 mb-6"
        >
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-brand-yellow font-extrabold text-2xl">4.9</p>
              <p className="text-gray-500 text-xs">Avaliação</p>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div>
              <p className="text-brand-yellow font-extrabold text-2xl">2.500+</p>
              <p className="text-gray-500 text-xs">Pacientes</p>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div>
              <p className="text-brand-yellow font-extrabold text-2xl">98%</p>
              <p className="text-gray-500 text-xs">Satisfação</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="px-4 pb-4">
          <motion.a
            href={EXTERNAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileTap={{ scale: 0.97 }}
            className="block w-full bg-brand-yellow text-brand-dark font-extrabold py-4 rounded-full text-base shadow-lg shadow-brand-yellow/20 text-center"
          >
            Quero escolher meu psicólogo
          </motion.a>
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mx-4 mb-8 bg-whatsapp-input rounded-xl p-4 flex items-start gap-3"
        >
          <Shield size={24} className="text-whatsapp-green shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-bold text-sm mb-1">Garantia de satisfação</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Se você não se sentir confortável com o profissional na primeira sessão, trocamos sem custo adicional.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
