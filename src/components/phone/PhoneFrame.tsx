import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[844px] max-h-[95vh] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-gray-800">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-3xl z-50" />
      {/* Screen */}
      <div className="h-full w-full overflow-hidden bg-whatsapp-dark flex flex-col pt-7">
        {children}
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
    </div>
  );
}
