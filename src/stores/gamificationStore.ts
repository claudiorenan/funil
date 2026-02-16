import { create } from 'zustand';
import type { Badge } from '../types';

interface GamificationState {
  xp: number;
  currentStep: number;
  stepLabel: string;
  badges: Badge[];
  showXPNotification: boolean;
  lastXPGain: number;
  showBadgeUnlock: boolean;
  lastBadge: Badge | null;
  addXP: (points: number) => void;
  setProgress: (step: number, label: string) => void;
  unlockBadge: (badge: Badge) => void;
  dismissXPNotification: () => void;
  dismissBadgeUnlock: () => void;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 0,
  currentStep: 0,
  stepLabel: '',
  badges: [],
  showXPNotification: false,
  lastXPGain: 0,
  showBadgeUnlock: false,
  lastBadge: null,

  addXP: (points) =>
    set((state) => ({
      xp: state.xp + points,
      lastXPGain: points,
      showXPNotification: true,
    })),

  setProgress: (step, label) => set({ currentStep: step, stepLabel: label }),

  unlockBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, { ...badge, unlockedAt: Date.now() }],
      showBadgeUnlock: true,
      lastBadge: badge,
    })),

  dismissXPNotification: () => set({ showXPNotification: false }),
  dismissBadgeUnlock: () => set({ showBadgeUnlock: false }),

  reset: () =>
    set({
      xp: 0,
      currentStep: 0,
      stepLabel: '',
      badges: [],
      showXPNotification: false,
      lastXPGain: 0,
      showBadgeUnlock: false,
      lastBadge: null,
    }),
}));
