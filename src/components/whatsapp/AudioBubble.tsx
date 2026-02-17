import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Type } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import type { ChatMessage } from '../../types';

interface AudioBubbleProps {
  message: ChatMessage;
  autoPlay?: boolean;
}

export default function AudioBubble({ message, autoPlay = false }: AudioBubbleProps) {
  const isLead = message.sender === 'lead';
  const duration = message.audioDuration || 12;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showText, setShowText] = useState(false);
  const selectChoice = useChatStore((s) => s.selectChoice);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  // Clean text for speech (remove emojis, fix pronunciation)
  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{200D}]/gu, '')
      .replace(/🎙️/g, '')
      // Pronunciation fixes
      .replace(/Psi/gi, 'pici')
      .replace(/Terapeutica\.ia/gi, 'Terapêutica')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    startTimeRef.current = Date.now();
    const durationMs = duration * 1000;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current);
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        stopProgress();
      }
    }, 50);
  }, [duration, stopProgress]);

  const findFemaleVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    const femaleNames = ['fernanda', 'maria', 'raquel', 'luciana', 'francisca', 'female', 'mulher', 'feminino'];
    const maleNames = ['male', 'daniel', 'ricardo', 'jorge', 'masculino'];
    const ptVoices = voices.filter((v) => v.lang.startsWith('pt'));
    return (
      ptVoices.find((v) => femaleNames.some((n) => v.name.toLowerCase().includes(n)))
      || ptVoices.find((v) => v.lang === 'pt-BR' && !maleNames.some((n) => v.name.toLowerCase().includes(n)))
      || ptVoices.find((v) => !maleNames.some((n) => v.name.toLowerCase().includes(n)))
      || ptVoices[0]
    );
  }, []);

  const speak = useCallback((cancelOthers = false) => {
    const synth = window.speechSynthesis;
    if (cancelOthers) {
      synth.cancel();
    }

    const cleanText = cleanTextForSpeech(message.text);
    if (!cleanText) return;

    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = 'pt-BR';
    utt.rate = 1.05;
    utt.pitch = 1.1;

    const ptVoice = findFemaleVoice();
    if (ptVoice) {
      utt.voice = ptVoice;
    }

    utt.onstart = () => {
      setPlaying(true);
      setFinished(false);
      elapsedBeforePauseRef.current = 0;
      startProgress();
    };

    utt.onend = () => {
      setPlaying(false);
      setFinished(true);
      setProgress(100);
      stopProgress();
    };

    utt.onerror = () => {
      setPlaying(false);
      stopProgress();
    };

    utteranceRef.current = utt;
    elapsedBeforePauseRef.current = 0;
    // Queue the utterance (speechSynthesis queues naturally)
    synth.speak(utt);
  }, [message.text, findFemaleVoice, startProgress, stopProgress]);

  const togglePlay = useCallback(() => {
    const synth = window.speechSynthesis;

    if (finished || progress >= 100) {
      // Restart from beginning
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setFinished(false);
      speak(true); // cancel others on manual play
      return;
    }

    if (playing) {
      // Pause
      synth.pause();
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      stopProgress();
      setPlaying(false);
    } else if (synth.paused) {
      // Resume
      synth.resume();
      startProgress();
      setPlaying(true);
    } else {
      // Start fresh - cancel others on manual play
      speak(true);
    }
  }, [playing, finished, progress, speak, startProgress, stopProgress]);

  // Ensure voices are loaded (some browsers load async)
  const [voicesReady, setVoicesReady] = useState(false);
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (synth.getVoices().length > 0) {
      setVoicesReady(true);
    } else {
      const handler = () => setVoicesReady(true);
      synth.addEventListener('voiceschanged', handler);
      return () => synth.removeEventListener('voiceschanged', handler);
    }
  }, []);

  // Auto-play when requested and voices are ready (queues, doesn't cancel others)
  const hasAutoPlayed = useRef(false);
  useEffect(() => {
    if (autoPlay && voicesReady && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const t = setTimeout(() => speak(false), 300);
      return () => clearTimeout(t);
    }
  }, [autoPlay, voicesReady, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      stopProgress();
    };
  }, [stopProgress]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Generate waveform bars
  const bars = Array.from({ length: 28 }, (_, i) => {
    const seed = (i * 7 + 3) % 13;
    return 0.2 + (seed / 13) * 0.8;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex ${isLead ? 'justify-end' : 'justify-start'} ${!isLead && !showText ? 'mb-7' : 'mb-1'}`}
    >
      <div
        className={`relative max-w-[75%] px-2 py-2 rounded-lg ${
          isLead
            ? 'bg-whatsapp-outgoing rounded-tr-none'
            : 'bg-[#202C33] rounded-tl-none'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Avatar (only for orientadora) */}
          {!isLead && (
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
              <img
                src="/assets/orientadora-avatar.png"
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<span class="text-white text-sm font-bold flex items-center justify-center w-full h-full bg-whatsapp-header">T</span>';
                }}
              />
            </div>
          )}

          {/* Play button */}
          <button onClick={togglePlay} className="shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {playing ? (
                <Pause size={16} className="text-white" />
              ) : (
                <Play size={16} className="text-white ml-0.5" />
              )}
            </div>
          </button>

          {/* Waveform */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-end gap-[2px] h-5">
              {bars.map((h, i) => {
                const barProgress = (i / bars.length) * 100;
                const isActive = barProgress <= progress;
                return (
                  <div
                    key={i}
                    className={`w-[3px] rounded-full transition-colors duration-150 ${
                      isActive ? 'bg-white' : 'bg-white/30'
                    }`}
                    style={{ height: `${h * 100}%` }}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                {playing ? formatTime((progress / 100) * duration) : formatTime(duration)}
              </span>
              <span className="text-[10px] text-gray-400">{message.timestamp}</span>
            </div>
          </div>
        </div>
        {/* Switch to text button (only for orientadora) */}
        {!isLead && !showText && (
          <button
            onClick={() => {
              setShowText(true);
              selectChoice('preferencia_comunicacao', 'Por texto');
              window.speechSynthesis.cancel();
              setPlaying(false);
              stopProgress();
            }}
            className="absolute -bottom-6 right-1 flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
            aria-label="Mudar para texto"
          >
            <Type size={10} />
            <span>ver texto</span>
          </button>
        )}

        {/* Expanded text */}
        {showText && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-[13px] text-gray-300 leading-relaxed">{message.text}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
