import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';

export const LanguageSelection = () => {
  const { lang, setLang, t } = useLanguage();
  const { showToast } = useNotifications();

  const languages = [
    { code: 'en', title: 'English', sub: 'English language interface' },
    { code: 'hi', title: 'हिंदी (Hindi)', sub: 'हिंदी भाषा इंटरफेस' },
    { code: 'mr', title: 'मराठी (Marathi)', sub: 'मराठी भाषा इंटरफेस' }
  ];

  const handleSelect = (code, title) => {
    setLang(code);
    showToast(`Language changed to ${title}!`, 'success');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('language')} Selection</h1>
        <p className="text-sm text-slate-500 font-medium">Choose your preferred language for Khet Sathi</p>
      </div>

      <div className="space-y-3">
        {languages.map((l) => {
          const isSelected = lang === l.code;
          return (
            <Card
              key={l.code}
              hoverable
              onClick={() => handleSelect(l.code, l.title)}
              className={`flex items-center justify-between p-5 transition-all ${
                isSelected ? 'border-2 border-khet-500 bg-khet-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isSelected ? 'bg-khet-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{l.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{l.sub}</p>
                </div>
              </div>

              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-khet-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
