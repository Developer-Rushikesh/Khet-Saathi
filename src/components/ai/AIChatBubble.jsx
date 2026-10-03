import React from 'react';
import { Bot, User } from 'lucide-react';

export const AIChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 my-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-xs ${
          isUser
            ? 'bg-khet-600'
            : 'bg-gradient-to-tr from-earth-600 to-earth-500 shadow-earth-500/20'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
          isUser
            ? 'bg-khet-600 text-white rounded-tr-none'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        <span
          className={`block text-[10px] mt-1.5 text-right ${
            isUser ? 'text-khet-200' : 'text-slate-400'
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};
