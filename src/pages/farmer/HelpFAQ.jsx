import React, { useState } from 'react';
import { HelpCircle, PhoneCall, Mail, ChevronDown, User, Code2, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('helpFaq')}</h1>
        <p className="text-xs text-slate-500 font-medium">Frequently asked questions & technical developer support</p>
      </div>

      {/* Developer & Support Card */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md text-emerald-100">
              Lead Architect & Developer
            </span>
          </div>
          <Code2 className="w-5 h-5 text-emerald-200" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-300" /> Rushikesh Pawar
          </h2>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            Full-Stack Software Engineer • Khet Sathi Project Founder
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-700 text-xs">
          <a
            href="tel:+917083246105"
            className="flex items-center gap-2.5 bg-emerald-900/60 hover:bg-emerald-900 p-2.5 rounded-xl border border-emerald-600/50 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Contact Number</span>
              <span className="font-bold text-white">+91 7083246105</span>
            </div>
          </a>

          <a
            href="mailto:Rushikesh977@gmail.com"
            className="flex items-center gap-2.5 bg-emerald-900/60 hover:bg-emerald-900 p-2.5 rounded-xl border border-emerald-600/50 transition-colors"
          >
            <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Developer Email</span>
              <span className="font-bold text-white">Rushikesh977@gmail.com</span>
            </div>
          </a>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card key={idx} className="cursor-pointer" onClick={() => setOpenIdx(isOpen ? -1 : idx)}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 pr-2">{faq.q}</h4>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
