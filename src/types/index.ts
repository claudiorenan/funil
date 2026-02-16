export type Sender = 'orientadora' | 'lead' | 'system';

export type ChatStep =
  | { type: 'incoming-call' }
  | { type: 'audio-message'; sender: Sender; durationSec: number; delay: number }
  | { type: 'message'; sender: Sender; text: string; delay: number }
  | { type: 'typing'; duration: number }
  | { type: 'options'; choices: string[]; key?: string }
  | { type: 'text-input'; placeholder: string; key: string }
  | {
      type: 'conditional-options';
      key: string;
      conditionKey: string;
      branches: Record<string, { question: string; choices: string[] }>;
    }
  | { type: 'progress'; step: number; label: string }
  | { type: 'navigate'; to: string; delay: number };

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isAudio?: boolean;
  audioDuration?: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt?: number;
}

export interface Psychologist {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  approach: string;
  availability: string;
  priceRange: string;
  rating: number;
  bio: string;
  tags: string[];
}
