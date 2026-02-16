import { Signal, Wifi, Battery } from 'lucide-react';

export default function StatusBar() {
  const time = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between px-6 py-1 bg-whatsapp-header text-white text-xs">
      <span className="font-medium">{time}</span>
      <div className="flex items-center gap-1">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={12} />
      </div>
    </div>
  );
}
