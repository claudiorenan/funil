import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PhoneFrame from '../components/phone/PhoneFrame';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 768px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function PhoneSimulatorLayout() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark to-gray-900 flex items-center justify-center p-4">
        <PhoneFrame>
          <Outlet />
        </PhoneFrame>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-whatsapp-dark flex flex-col overflow-hidden">
      <Outlet />
    </div>
  );
}
