import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Check, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '../stores/chatStore';

const PIX_KEY = 'pagamento@cademeupsi.com.br';
const WHATSAPP_NUMBER = '555182716355';

export default function MatchPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const selectedChoices = useChatStore((s) => s.selectedChoices);
  const nome = selectedChoices['nome'] || 'você';
  const pilar = selectedChoices['pilar'] || 'seu tema';

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = PIX_KEY;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendReceipt = () => {
    const message = encodeURIComponent(
      `Olá! Sou ${nome}, acabei de fazer o pagamento do grupo e gostaria de enviar o comprovante.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-whatsapp-dark">
      {/* Header */}
      <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3 shrink-0">
        <button onClick={() => navigate('/triagem')} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-base">Grupo de Apoio</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 px-4"
        >
          <Users size={40} className="text-brand-yellow mx-auto mb-3" />
          <h2 className="text-white font-extrabold text-xl mb-2">
            Grupo focado em: {pilar}
          </h2>
          <p className="text-gray-400 text-sm">
            Conteúdo exclusivo de psicólogos especializados para te ajudar. Além do grupo, contamos com uma rede de mais de 1.300 profissionais prontos para te apoiar.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-4 bg-[#202C33] rounded-xl p-4 mb-4"
        >
          <h3 className="text-white font-bold text-sm mb-3">O que você recebe:</h3>
          <ul className="space-y-2">
            {[
              `Conteúdos de psicólogos especializados em ${pilar.toLowerCase()}`,
              'Grupo de apoio com pessoas na mesma situação',
              'Rede com mais de 1.300 profissionais para te ajudar',
              'Materiais exclusivos para sua jornada',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-whatsapp-green mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-4 bg-gradient-to-r from-whatsapp-green/20 to-whatsapp-green/5 border border-whatsapp-green/30 rounded-xl p-4 mb-6 text-center"
        >
          <p className="text-gray-400 text-xs mb-1">Investimento único</p>
          <p className="text-white font-extrabold text-3xl">R$ 27<span className="text-lg">,00</span></p>
        </motion.div>

        {/* PIX Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mb-4"
        >
          <h3 className="text-white font-bold text-sm mb-3 text-center">Pague via PIX:</h3>

          {/* PIX Key */}
          <div className="bg-[#202C33] rounded-xl p-4 mb-3">
            <p className="text-gray-400 text-xs mb-2">Chave PIX (e-mail):</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-whatsapp-green text-sm font-mono bg-black/20 rounded-lg px-3 py-2 break-all">
                {PIX_KEY}
              </code>
              <button
                onClick={handleCopyPix}
                className="shrink-0 bg-whatsapp-green/20 text-whatsapp-green rounded-lg p-2 active:scale-95 transition-transform"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-whatsapp-green text-xs mt-2 text-center"
              >
                Chave copiada!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Send Receipt */}
        <div className="px-4 pb-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleSendReceipt}
            className="w-full bg-whatsapp-green text-white font-bold py-3 rounded-full text-sm text-center active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Enviar comprovante via WhatsApp
          </motion.button>
          <p className="text-gray-500 text-xs text-center mt-2">
            Após o pagamento, envie o comprovante para ser adicionado ao grupo.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
