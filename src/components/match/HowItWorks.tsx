import { motion } from 'framer-motion';
import { UserCheck, Calendar, RefreshCw } from 'lucide-react';

const steps = [
  { icon: UserCheck, title: 'Escolha', desc: 'Selecione o profissional que mais combina com você' },
  { icon: Calendar, title: 'Agende', desc: 'Marque sua primeira sessão no horário que preferir' },
  { icon: RefreshCw, title: 'Troque se quiser', desc: 'Não curtiu? Troque de psicólogo sem custo' },
];

export default function HowItWorks() {
  return (
    <div className="py-6 px-4">
      <h3 className="text-white font-bold text-center mb-6">Como funciona</h3>
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-whatsapp-green/20 flex items-center justify-center shrink-0">
              <step.icon size={22} className="text-whatsapp-green" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{step.title}</p>
              <p className="text-gray-400 text-xs">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
