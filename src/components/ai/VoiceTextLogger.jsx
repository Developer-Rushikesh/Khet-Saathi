import React, { useState } from 'react';
import { Mic, Send, Sparkles, Check, Edit2, X, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { mockApi } from '../../api/mockApi';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const VoiceTextLogger = () => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedActivity, setParsedActivity] = useState(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleSpeech = () => {
    // Simulate Voice Recording Speech-to-Text
    setIsListening(true);
    setTimeout(() => {
      setInputText('Aaj subah soybean ko paani diya');
      setIsListening(false);
    }, 1500);
  };

  const handleParse = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const result = await mockApi.parseTellKhetSaathiInput(inputText);
      setParsedActivity(result);
    } catch (e) {
      showToast('Could not process sentence', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!parsedActivity) return;
    setLoading(true);
    try {
      await mockApi.createActivity(parsedActivity);
      showToast('Activity recorded successfully via Tell Khet Saathi!', 'success');
      setParsedActivity(null);
      setInputText('');
      navigate('/activity-history');
    } catch (e) {
      showToast('Failed to save activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-earth-50 to-white border border-earth-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-earth-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Tell Khet Saathi</h3>
          <p className="text-xs text-slate-500">Type or speak your farming activity in simple words</p>
        </div>
      </div>

      {!parsedActivity ? (
        <form onSubmit={handleParse} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Aaj subah soybean ko paani diya..."
            className="w-full text-sm rounded-xl border border-earth-300 bg-white py-3 pl-4 pr-24 text-slate-800 placeholder-slate-400 focus:border-earth-500 focus:ring-2 focus:ring-earth-500/20 shadow-xs"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleSpeech}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? 'bg-rose-500 text-white animate-bounce' : 'text-earth-600 hover:bg-earth-100'
              }`}
              title="Speak activity"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2 bg-earth-600 hover:bg-earth-700 text-white rounded-lg disabled:opacity-40 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border-2 border-earth-400 rounded-xl p-4 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <span className="text-xs font-bold text-earth-700 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-earth-500" />
              AI understood this activity:
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-bold">
              Ready to Save
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div>
              <span className="text-slate-400 block">Activity</span>
              <span className="font-bold text-slate-800 text-sm">{parsedActivity.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Crop</span>
              <span className="font-bold text-slate-800 text-sm">{parsedActivity.cropName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Date</span>
              <span className="font-bold text-slate-800 text-sm">{parsedActivity.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Farm</span>
              <span className="font-bold text-slate-800 text-sm">{parsedActivity.farmName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <Button variant="primary" size="sm" icon={Check} onClick={handleConfirmSave} disabled={loading}>
              Save Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => navigate('/add-activity', { state: parsedActivity })}
            >
              Edit Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={() => setParsedActivity(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
