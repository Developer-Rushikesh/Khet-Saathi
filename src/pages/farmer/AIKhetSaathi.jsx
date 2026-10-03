import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, History, RefreshCw, Loader2 } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { AIChatBubble } from '../../components/ai/AIChatBubble';
import { VoiceTextLogger } from '../../components/ai/VoiceTextLogger';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const AIKhetSaathi = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "Last spray kab kiya?",
    "Last irrigation kab hui?",
    "Is month kya activities hui?",
    "Total expense kitna hai?",
    "Next reminder kya hai?"
  ];

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAIChatHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    setInputQuery('');
    setSending(true);

    try {
      const { userMsg, aiMsg } = await mockApi.askAI(text);
      setHistory(prev => [...prev, userMsg, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner message="Connecting to AI Khet Saathi assistant..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-earth-600 to-earth-500 text-white flex items-center justify-center shadow-lg shadow-earth-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">AI Khet Saathi Assistant</h1>
            <p className="text-xs text-slate-500 font-medium">Smart AI query system for your recorded farm data</p>
          </div>
        </div>

        <Link
          to="/ai-history"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </Link>
      </div>

      {/* Voice/Text Natural Logger Box */}
      <VoiceTextLogger />

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[500px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
          {history.map((msg) => (
            <AIChatBubble key={msg.id} message={msg} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-earth-700 text-xs font-semibold p-3 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI Khet Saathi is searching your farm records...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions Chips */}
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-earth-500" />
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-earth-50 hover:bg-earth-100 text-earth-800 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border border-earth-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('aiPlaceholder')}
            className="flex-1 text-sm rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-earth-500 focus:outline-none focus:ring-2 focus:ring-earth-500/20"
          />
          <button
            type="submit"
            disabled={sending || !inputQuery.trim()}
            className="p-3 bg-earth-600 hover:bg-earth-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
