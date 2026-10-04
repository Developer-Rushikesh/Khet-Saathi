import React, { useState } from 'react';
import { HelpCircle, PhoneCall, ChevronDown, Sprout, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';

export const HelpFAQ = () => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How does Khet Sathi help me manage multiple farms?",
      a: "You can create separate records for each farm (e.g. Main Farm, Riverbank Land) with area in acres or hectares. Crops, sprays, and expenses can be assigned directly to specific farms."
    },
    {
      q: "Does Khet Sathi give automatic pesticide dosages?",
      a: "No. Khet Sathi is a digital record book and reminder assistant. It records what products you sprayed and when, but does not dictate medical or chemical dosages."
    },
    {
      q: "Can I use voice to enter activities?",
      a: "Yes! Use the 'Tell Khet Saathi' box on your dashboard or AI Assistant page. Speak or type sentences like 'Aaj subah soybean ko paani diya' and Khet Sathi will extract the details for one-click confirmation."
    },
    {
      q: "How do reminders work if I am offline?",
      a: "Reminders are stored locally on your mobile device and will prompt you on your scheduled dates."
    },
    {
      q: "Is my farm data safe?",
      a: "Yes, all your digital records are kept private to your farmer account."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('helpFaq')}</h1>
        <p className="text-sm text-slate-500 font-medium">Frequently asked questions and helpline support</p>
      </div>

      {/* Helpline banner */}
      <div className="bg-gradient-to-r from-khet-600 to-khet-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-khet-200 block">Kisan Helpline & Assistance</span>
          <h3 className="text-xl font-extrabold mt-1">1800-180-1551 (Toll Free)</h3>
          <p className="text-xs text-khet-100 mt-1 font-medium">Available Mon-Sat 6:00 AM to 10:00 PM</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
          <PhoneCall className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card key={idx} className="cursor-pointer" onClick={() => setOpenIdx(isOpen ? -1 : idx)}>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900 pr-2">{faq.q}</h4>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              {isOpen && (
                <p className="text-xs text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
