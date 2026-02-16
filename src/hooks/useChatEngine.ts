import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { chatScript } from '../data/chatScript';
import type { ChatStep } from '../types';

let stepIdCounter = 0;

function resolveTemplate(text: string, choices: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => choices[key] || key);
}

function makeTimestamp(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function estimateAudioDuration(text: string): number {
  // ~12 chars per second for Portuguese speech
  return Math.max(3, Math.ceil(text.length / 12));
}

function prefersAudio(): boolean {
  return useChatStore.getState().selectedChoices['preferencia_comunicacao'] === 'Pode mandar áudio';
}

export function useChatEngine() {
  const navigate = useNavigate();
  const {
    messages,
    currentStepIndex,
    isTyping,
    showIncomingCall,
    waitingForChoice,
    waitingForTextInput,
    textInputPlaceholder,
    choices,
    addMessage,
    setTyping,
    setShowIncomingCall,
    setWaitingForChoice,
    setWaitingForTextInput,
    selectChoice,
    advanceStep,
  } = useChatStore();

  const { setProgress } = useGamificationStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const startedStepRef = useRef(-1);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Process steps sequentially
  useEffect(() => {
    if (showIncomingCall || waitingForChoice || waitingForTextInput) return;
    if (currentStepIndex >= chatScript.length) return;
    if (startedStepRef.current === currentStepIndex) return;
    startedStepRef.current = currentStepIndex;

    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const runStep = async () => {
      const step: ChatStep = chatScript[currentStepIndex];

      switch (step.type) {
        case 'incoming-call':
          setShowIncomingCall(true);
          return; // wait for user to answer

        case 'audio-message': {
          const greeting = getGreeting();
          addMessage({
            id: `msg-${++stepIdCounter}`,
            sender: step.sender,
            text: `🎙️ ${greeting}! Aqui é a Terapeutica.ia do Cadê Meu Psi...`,
            timestamp: makeTimestamp(),
            status: step.sender === 'lead' ? 'read' : 'delivered',
            isAudio: true,
            audioDuration: step.durationSec,
          });
          scrollToBottom();
          // Wait for audio to finish + 3s pause
          await delay((step.durationSec * 1000) + 100);
          break;
        }

        case 'typing':
          setTyping(true);
          scrollToBottom();
          await delay(step.duration);
          setTyping(false);
          break;

        case 'message': {
          const resolvedText = resolveTemplate(step.text, useChatStore.getState().selectedChoices);
          const sendAsAudio = step.sender === 'orientadora' && prefersAudio();
          const audioDur = sendAsAudio ? estimateAudioDuration(resolvedText) : 0;
          addMessage({
            id: `msg-${++stepIdCounter}`,
            sender: step.sender,
            text: resolvedText,
            timestamp: makeTimestamp(),
            status: step.sender === 'lead' ? 'read' : 'delivered',
            ...(sendAsAudio && {
              isAudio: true,
              audioDuration: audioDur,
            }),
          });
          scrollToBottom();
          if (sendAsAudio) {
            // Wait for audio to finish + 3s pause
            await delay((audioDur * 1000) + 100);
            // After audio question, send "?" as text so user sees the context
            if (resolvedText.includes('?')) {
              addMessage({
                id: `msg-${++stepIdCounter}`,
                sender: 'orientadora',
                text: '?',
                timestamp: makeTimestamp(),
                status: 'delivered',
              });
              scrollToBottom();
            }
          } else if (step.delay > 0) {
            await delay(step.delay);
          }
          break;
        }

        case 'options':
          setWaitingForChoice(true, step.choices);
          scrollToBottom();
          return;

        case 'text-input':
          setWaitingForTextInput(true, step.placeholder, step.key);
          scrollToBottom();
          return;

        case 'conditional-options': {
          const state = useChatStore.getState();
          const conditionValue = state.selectedChoices[step.conditionKey];
          const branch = step.branches[conditionValue];
          if (branch) {
            const sendAsAudio = prefersAudio();
            const audioDur = sendAsAudio ? estimateAudioDuration(branch.question) : 0;
            addMessage({
              id: `msg-${++stepIdCounter}`,
              sender: 'orientadora',
              text: branch.question,
              timestamp: makeTimestamp(),
              status: 'delivered',
              ...(sendAsAudio && {
                isAudio: true,
                audioDuration: audioDur,
              }),
            });
            scrollToBottom();
            if (sendAsAudio) {
              // Wait for audio to finish + 3s pause, then send "?"
              await delay((audioDur * 1000) + 100);
              addMessage({
                id: `msg-${++stepIdCounter}`,
                sender: 'orientadora',
                text: '?',
                timestamp: makeTimestamp(),
                status: 'delivered',
              });
              scrollToBottom();
            } else {
              await delay(600);
            }
            setWaitingForChoice(true, branch.choices);
            scrollToBottom();
          }
          return;
        }

        case 'progress':
          setProgress(step.step, step.label);
          break;

        case 'navigate':
          await delay(step.delay);
          navigate(step.to);
          return;
      }

      advanceStep();
    };

    runStep();
  }, [currentStepIndex, showIncomingCall, waitingForChoice, waitingForTextInput, addMessage, setTyping, setShowIncomingCall, setWaitingForChoice, setWaitingForTextInput, setProgress, navigate, scrollToBottom, advanceStep]);

  // Handle answering the call
  const handleAnswerCall = useCallback(() => {
    setShowIncomingCall(false);
    startedStepRef.current = -1;
    advanceStep();
  }, [setShowIncomingCall, advanceStep]);

  const handleDeclineCall = useCallback(() => {
    // Decline just dismisses and restarts the call after a delay
    setShowIncomingCall(false);
    setTimeout(() => {
      startedStepRef.current = -1;
      setShowIncomingCall(true);
    }, 2000);
  }, [setShowIncomingCall]);

  // Handle user choice
  const handleChoice = useCallback(
    (choice: string) => {
      const step = chatScript[currentStepIndex];
      let key = 'choice';
      if (step.type === 'options' && step.key) {
        key = step.key;
      } else if (step.type === 'conditional-options') {
        key = step.key;
      }

      addMessage({
        id: `msg-${++stepIdCounter}`,
        sender: 'lead',
        text: choice,
        timestamp: makeTimestamp(),
        status: 'read',
      });

      selectChoice(key, choice);
      setWaitingForChoice(false);
      startedStepRef.current = -1;
      advanceStep();
      scrollToBottom();
    },
    [currentStepIndex, addMessage, selectChoice, setWaitingForChoice, advanceStep, scrollToBottom],
  );

  // Handle text input
  const handleTextSubmit = useCallback(
    (text: string) => {
      const step = chatScript[currentStepIndex];
      const key = step.type === 'text-input' ? step.key : 'text';

      addMessage({
        id: `msg-${++stepIdCounter}`,
        sender: 'lead',
        text,
        timestamp: makeTimestamp(),
        status: 'read',
      });

      selectChoice(key, text);
      setWaitingForTextInput(false);
      startedStepRef.current = -1;
      advanceStep();
      scrollToBottom();
    },
    [currentStepIndex, addMessage, selectChoice, setWaitingForTextInput, advanceStep, scrollToBottom],
  );

  return {
    messages,
    isTyping,
    showIncomingCall,
    waitingForChoice,
    waitingForTextInput,
    textInputPlaceholder,
    choices,
    handleAnswerCall,
    handleDeclineCall,
    handleChoice,
    handleTextSubmit,
    chatEndRef,
  };
}
