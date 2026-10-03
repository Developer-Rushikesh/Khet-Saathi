import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Bot, Calendar } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/common/Card';

export const AIChatHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  if (loading) return <LoadingSpinner message="Loading chat history..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/ai-assistant')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Saathi Assistant</span>
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">AI Chat Log & Query History</h1>
        <p className="text-sm text-slate-500 font-medium">Archived responses and natural activity queries</p>
      </div>

      <div className="space-y-4">
        {history.map((msg) => (
          <Card key={msg.id} className={msg.sender === 'user' ? 'border-l-4 border-l-khet-600' : 'border-l-4 border-l-earth-500'}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className={msg.sender === 'user' ? 'text-khet-700' : 'text-earth-700'}>
                {msg.sender === 'user' ? '👤 Farmer Question' : '🤖 AI Khet Saathi Answer'}
              </span>
              <span className="text-slate-400 font-medium">{msg.timestamp}</span>
            </div>
            <p className="text-sm text-slate-800 mt-1">{msg.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
