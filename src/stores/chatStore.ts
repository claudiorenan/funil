import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  currentStepIndex: number;
  isTyping: boolean;
  showIncomingCall: boolean;
  waitingForChoice: boolean;
  waitingForTextInput: boolean;
  textInputPlaceholder: string;
  textInputKey: string;
  choices: string[];
  selectedChoices: Record<string, string>;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  setShowIncomingCall: (show: boolean) => void;
  setWaitingForChoice: (waiting: boolean, choices?: string[]) => void;
  setWaitingForTextInput: (waiting: boolean, placeholder?: string, key?: string) => void;
  selectChoice: (key: string, choice: string) => void;
  advanceStep: () => void;
  setStepIndex: (index: number) => void;
  reset: () => void;
}

const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentStepIndex: 0,
  isTyping: false,
  showIncomingCall: true,
  waitingForChoice: false,
  waitingForTextInput: false,
  textInputPlaceholder: '',
  textInputKey: '',
  choices: [],
  selectedChoices: {},

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: message.timestamp || now() }],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  setShowIncomingCall: (show) => set({ showIncomingCall: show }),

  setWaitingForChoice: (waiting, choices = []) =>
    set({ waitingForChoice: waiting, choices }),

  setWaitingForTextInput: (waiting, placeholder = '', key = '') =>
    set({ waitingForTextInput: waiting, textInputPlaceholder: placeholder, textInputKey: key }),

  selectChoice: (key, choice) =>
    set((state) => ({
      selectedChoices: { ...state.selectedChoices, [key]: choice },
    })),

  advanceStep: () =>
    set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),

  setStepIndex: (index) => set({ currentStepIndex: index }),

  reset: () =>
    set({
      messages: [],
      currentStepIndex: 0,
      isTyping: false,
      showIncomingCall: true,
      waitingForChoice: false,
      waitingForTextInput: false,
      textInputPlaceholder: '',
      textInputKey: '',
      choices: [],
      selectedChoices: {},
    }),
}));
