import React from 'react';
import { User } from 'lucide-react';
import logo2 from '../../images/logo2.png';

export const AIChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 my-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-xs overflow-hidden ${
          isUser
            ? 'bg-khet-600'
            : 'bg-white border border-earth-300 p-0.5'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <img src={logo2} alt="Bot" className="w-full h-full object-contain" />}
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
