import StatusBar from '../components/phone/StatusBar';
import ChatHeader from '../components/whatsapp/ChatHeader';
import MessageBubble from '../components/whatsapp/MessageBubble';
import AudioBubble from '../components/whatsapp/AudioBubble';
import TypingIndicator from '../components/whatsapp/TypingIndicator';
import QuickReplies from '../components/whatsapp/QuickReplies';
import ChatInput from '../components/whatsapp/ChatInput';
import ProgressBar from '../components/gamification/ProgressBar';
import IncomingCall from '../components/phone/IncomingCall';
import { useChatEngine } from '../hooks/useChatEngine';

export default function WhatsAppChat() {
  const {
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
  } = useChatEngine();

  return (
    <div className="flex flex-col h-full relative">
      <IncomingCall
        visible={showIncomingCall}
        onAnswer={handleAnswerCall}
        onDecline={handleDeclineCall}
      />

      <StatusBar />
      <ChatHeader />
      <ProgressBar />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto chat-scroll whatsapp-bg px-3 py-2">
        {messages.map((msg, idx) =>
          msg.isAudio ? (
            <AudioBubble
              key={msg.id}
              message={msg}
              autoPlay={idx === messages.length - 1}
            />
          ) : (
            <MessageBubble key={msg.id} message={msg} />
          ),
        )}
        <TypingIndicator visible={isTyping} />
        <QuickReplies
          choices={choices}
          visible={waitingForChoice}
          onSelect={handleChoice}
        />
        <div ref={chatEndRef} />
      </div>

      <ChatInput
        waitingForText={waitingForTextInput}
        placeholder={textInputPlaceholder}
        onSubmit={handleTextSubmit}
      />
    </div>
  );
}
