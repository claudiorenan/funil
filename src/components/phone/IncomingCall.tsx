import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallProps {
  visible: boolean;
  onAnswer: () => void;
  onDecline: () => void;
}

function createVibrationSound(ctx: AudioContext): { start: () => void; stop: () => void } {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

  const buzz = () => {
    if (ctx.state === 'closed') return;
    const t = ctx.currentTime;

    // Three longer buzzes like a phone vibrating on a table
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Low rumble frequency for vibration sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t + offset);
      osc.frequency.linearRampToValueAtTime(120, t + offset + 0.35);

      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(0.1, t + offset + 0.03);
      gain.gain.setValueAtTime(0.1, t + offset + 0.3);
      gain.gain.linearRampToValueAtTime(0, t + offset + 0.4);

      osc.start(t + offset);
      osc.stop(t + offset + 0.42);
      activeNodes.push({ osc, gain });

      osc.onended = () => {
        activeNodes = activeNodes.filter((n) => n.osc !== osc);
      };
    }
  };

  return {
    start: () => {
      buzz();
      intervalId = setInterval(buzz, 2200);
    },
    stop: () => {
      if (intervalId) clearInterval(intervalId);
      for (const { osc, gain } of activeNodes) {
        try { osc.stop(); gain.disconnect(); } catch { /* already stopped */ }
      }
      activeNodes = [];
    },
  };
}

export default function IncomingCall({ visible, onAnswer, onDecline }: IncomingCallProps) {
  const ringtoneRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  // Try to start audio immediately (works if user has interacted with page before)
  useEffect(() => {
    if (!visible) {
      ringtoneRef.current?.stop();
      ringtoneRef.current = null;
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
      setAudioStarted(false);
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const ringtone = createVibrationSound(ctx);
    ringtoneRef.current = ringtone;

    // If context starts running, play immediately
    if (ctx.state === 'running') {
      ringtone.start();
      setAudioStarted(true);
    } else {
      // Try to resume (might work on some browsers)
      ctx.resume().then(() => {
        if (ctx.state === 'running') {
          ringtone.start();
          setAudioStarted(true);
        }
      });
    }

    // Mobile vibration
    const vibratePattern = () => {
      if (navigator.vibrate) {
        navigator.vibrate([400, 200, 400, 200, 400, 1000]);
      }
    };
    vibratePattern();
    const vibrateInterval = setInterval(vibratePattern, 2200);

    return () => {
      ringtone.stop();
      if (ctx.state !== 'closed') ctx.close();
      clearInterval(vibrateInterval);
      if (navigator.vibrate) navigator.vibrate(0);
    };
  }, [visible]);

  // Start audio on first tap anywhere on the call screen
  const handleScreenTap = () => {
    if (audioStarted) return;
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (ringtoneRef.current && ctx.state === 'running') {
          ringtoneRef.current.start();
          setAudioStarted(true);
        }
      });
    }
  };

  const handleAnswer = () => {
    ringtoneRef.current?.stop();
    if (navigator.vibrate) navigator.vibrate(0);
    onAnswer();
  };

  const handleDecline = () => {
    ringtoneRef.current?.stop();
    if (navigator.vibrate) navigator.vibrate(0);
    onDecline();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleScreenTap}
          className="absolute inset-0 z-[100] bg-gradient-to-b from-[#075E54] to-[#0b141a] flex flex-col items-center justify-between py-16 px-6"
        >
          {/* Caller info with shake */}
          <motion.div
            className="flex flex-col items-center gap-4 mt-8"
            animate={{
              x: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              y: [0, -1, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Ripple rings */}
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/15"
                animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
              <motion.div
                animate={{ rotate: [0, -2, 2, -2, 2, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden relative z-10"
              >
                <img
                  src="/assets/orientadora-avatar.png"
                  alt="Terapeutica.ia"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span class="text-white text-3xl font-bold flex items-center justify-center w-full h-full bg-whatsapp-header">T</span>';
                  }}
                />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-white font-bold text-xl">Terapeutica.ia</h2>
              <motion.p
                className="text-green-300 text-sm mt-1"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Chamada recebida...
              </motion.p>
            </div>
          </motion.div>

          {/* Tap hint if audio not started */}
          {!audioStarted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/50 text-xs absolute top-8 left-0 right-0 text-center"
            >
              Toque na tela para ativar o som
            </motion.p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-16 mb-8">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); handleDecline(); }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <PhoneOff size={28} className="text-white" />
              </motion.button>
              <span className="text-white/60 text-xs">Recusar</span>
            </div>

            {/* Answer */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(37, 211, 102, 0.4)',
                    '0 0 0 16px rgba(37, 211, 102, 0)',
                    '0 0 0 0 rgba(37, 211, 102, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={(e) => { e.stopPropagation(); handleAnswer(); }}
                className="w-16 h-16 bg-whatsapp-green rounded-full flex items-center justify-center"
              >
                <Phone size={28} className="text-white" />
              </motion.button>
              <span className="text-white/60 text-xs">Atender</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
