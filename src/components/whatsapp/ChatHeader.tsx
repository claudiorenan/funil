import { ArrowLeft, Phone, MoreVertical } from 'lucide-react';

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 bg-whatsapp-header px-3 py-2 shrink-0">
      <ArrowLeft size={20} className="text-white" />
      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shrink-0">
        <img
          src="/assets/orientadora-avatar.png"
          alt="Terapeutica.ia"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.innerHTML =
              '<span class="text-white text-lg font-bold">T</span>';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">Terapeutica.ia - Cadê Meu Psi</p>
        <p className="text-green-300 text-xs">online</p>
      </div>
      <div className="flex items-center gap-4 text-white">
        <Phone size={18} />
        <MoreVertical size={18} />
      </div>
    </div>
  );
}
