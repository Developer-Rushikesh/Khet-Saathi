import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, History, Loader2, Globe } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { AIChatBubble } from '../../components/ai/AIChatBubble';
import { VoiceTextLogger } from '../../components/ai/VoiceTextLogger';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const AIKhetSaathi = () => {
  const { lang, setLang, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestionsByLang = {
    en: [
      "Last spray date & chemical?",
      "Last irrigation recorded?",
      "Total farm expenses this season?",
      "Soybean crop net profit?",
      "Next upcoming reminder?"
    ],
    hi: [
      "अंतिम फवारणी कब की थी?",
      "अंतिम सिंचाई कब हुई?",
      "इस सीजन का कुल खर्च?",
      "सोयाबीन फसल का शुद्ध लाभ?",
      "अगला रिमाइंडर क्या है?"
    ],
    mr: [
      "शेवटची फवारणी कधी केली?",
      "शेवटचे पाणी कधी दिले?",
      "या हंगामातील एकूण खर्च किती?",
      "सोयाबीन पिकाचा नफा किती झाला?",
      "पुढील रिमाइंडर कोणते आहे?"
    ]
  };

  const suggestedQuestions = suggestedQuestionsByLang[lang] || suggestedQuestionsByLang.en;

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

  if (loading) return <LoadingSpinner message="Connecting to Khet Sathi assistant..." />;

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Khet Sathi AI Assistant</h1>
            <p className="text-xs text-slate-500 font-medium">Data-grounded AI query system for your farm history</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tri-Lingual Toggle Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === 'mr' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              मराठी
            </button>
          </div>

          <Link
            to="/ai-history"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </Link>
        </div>
      </div>

      {/* Voice/Text Natural Logger Box */}
      <VoiceTextLogger />

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[500px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
          {history.map((msg) => (
            <AIChatBubble key={msg.id} message={msg} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Khet Sathi is searching your farm records...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions Chips */}
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Suggested ({lang.toUpperCase()}):
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border border-emerald-200"
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
            placeholder={
              lang === 'hi'
                ? "अपनी फसल या खेत का सवाल पूछें..."
                : lang === 'mr'
                ? "तुमच्या पिकाबद्दल किंवा शेताबद्दल प्रश्न विचारा..."
                : "Ask anything about your crop, spray, or farm expenses..."
            }
            className="flex-1 text-sm rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || sending}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
