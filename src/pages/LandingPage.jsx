import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ShieldCheck,
  Zap,
  TrendingUp,
  Bell,
  Bot,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Globe2,
  LogIn,
  UserPlus,
  Compass,
  Calendar,
  CloudSun
} from 'lucide-react';
import logo1 from '../images/logo1.png';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 🌟 HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs overflow-hidden">
              <img src={logo1} alt="Khet Sathi" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Khet Sathi
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                Digital Farm Record Book
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-emerald-700 transition-colors">About</a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#why-us" className="hover:text-emerald-700 transition-colors">Why Khet Sathi</a>
            <a href="#support" className="hover:text-emerald-700 transition-colors">Support & FAQ</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                <Compass className="w-4 h-4" /> Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 text-xs transition-colors"
                >
                  <LogIn className="w-4 h-4 text-emerald-700" /> Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Smart Agriculture Record System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Empowering Farmers with <br className="hidden sm:inline" />
                <span className="text-emerald-700">Digital Farm Records</span> & AI Guidance
              </h1>

              <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Log farm activities, track crop expenses, set irrigation & spray reminders, and calculate net profits with <strong>Khet Sathi</strong> — India's simple, reliable digital farm diary.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Start Free Today <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 transition-colors"
                >
                  Explore Features
                </a>
              </div>

              {/* Key Features List */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Secure Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>English, Hindi & Marathi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Voice Activity Logging</span>
                </div>
              </div>
            </div>

            {/* Right Static Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      🌾
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Green Valley Farm #1</h4>
                      <p className="text-xs text-slate-600">Soybean (JS-335) • 45 Days Active</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md">
                    Healthy Crop
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500" /> Live Weather
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-1">28°C • Clear</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total Expense
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-1">₹14,500</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                  <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-900">Khet Sathi Assistant</span>
                    <p className="text-slate-600">
                      "Soybean crop is in flowering stage. Schedule 2nd dosage in 3 days."
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Next Spray:
                  </span>
                  <span className="font-bold text-slate-900">Tomorrow at 8:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 NUMERICAL STATS */}
      <section className="py-10 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">10,000+</p>
              <p className="text-xs text-slate-600 font-semibold uppercase mt-0.5">Farmers Registered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">50,000+</p>
              <p className="text-xs text-slate-600 font-semibold uppercase mt-0.5">Acres Managed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">99.8%</p>
              <p className="text-xs text-slate-600 font-semibold uppercase mt-0.5">Reminder Accuracy</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">3 Languages</p>
              <p className="text-xs text-slate-600 font-semibold uppercase mt-0.5">English, Hindi, Marathi</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 ABOUT SECTION */}
      <section id="about" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">About Khet Sathi</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Simple Digital Logbook for Indian Agriculture
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Paper notebooks get damaged or misplaced, causing forgotten spray dates and untracked input costs. Khet Sathi provides every farmer with a clear, permanent digital diary on their mobile phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Digital Farm Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log sowing, irrigation, fertilizer, spraying, labor costs, and harvest yields effortlessly.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Khet Sathi Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions in simple language like <em>"Last spray kab kiya?"</em> and get database-grounded answers.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Profit & Expense Clarity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track input costs versus market returns per crop to understand your net farm income.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURES SECTION */}
      <section id="features" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Features Built for Farmers</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything You Need to Manage Your Fields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Multi-Farm Management</h3>
              <p className="text-xs text-slate-600">Track multiple farm plots, survey numbers, and acreage independently.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Automated Reminders</h3>
              <p className="text-xs text-slate-600">Get timely reminders for irrigation, fertilizer doses, and pesticide sprays.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Expense & Profit Analytics</h3>
              <p className="text-xs text-slate-600">Categorized breakdown of input costs with clear charts and summaries.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Printable PDF Reports</h3>
              <p className="text-xs text-slate-600">Generate clean farm logs for crop loan applications and insurance audits.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Regional Language Support</h3>
              <p className="text-xs text-slate-600">Switch between English, Hindi (हिंदी), and Marathi (मराठी) anytime.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Voice Activity Entry</h3>
              <p className="text-xs text-slate-600">Speak into your mobile mic to log farm activities without manual typing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 WHY USE KHET SATHI */}
      <section id="why-us" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Why Use Khet Sathi</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Paper Diary vs. Khet Sathi Digital Record
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800">✕ Traditional Paper Diary</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li>• Notebooks get damaged, wet, or lost over time.</li>
                <li>• Forgotten spray dates cause crop yield loss.</li>
                <li>• Difficult to sum total labor & input costs.</li>
                <li>• No smart alerts or AI help.</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-emerald-900">✓ Khet Sathi Digital Platform</h3>
              <ul className="space-y-2.5 text-xs text-slate-800 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% safe cloud database backup.</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automatic spray & water reminders.</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant financial profit/loss reports.</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI assistant in English, Hindi, Marathi.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ SUPPORT & FAQ SECTION */}
      <section id="support" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Support & FAQ</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is Khet Sathi free to use for farmers?",
                a: "Yes! Creating an account, registering farms, logging activities, tracking expenses, and setting reminders is completely free."
              },
              {
                q: "How does the AI Khet Assistant answer questions about my farm?",
                a: "The AI Assistant checks your recorded activities, sprays, and crop dates directly from your secure profile to answer accurately."
              },
              {
                q: "Can I use Khet Sathi in Hindi or Marathi?",
                a: "Yes! Khet Sathi supports English, Hindi (हिंदी), and Marathi (मराठी). Switch language anytime in settings."
              },
              {
                q: "Is my farm data safe and private?",
                a: "Yes. Your farm records are private and secured under your login credentials."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between font-bold text-sm text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-3.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Helpdesk & Developer Support Banner */}
          <div className="mt-10 bg-emerald-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 font-bold border border-emerald-600">
                <PhoneCall className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white">Developer & Technical Support</h4>
                  <span className="px-2 py-0.5 bg-emerald-700 text-emerald-100 text-[10px] font-bold rounded-md">
                    Rushikesh Pawar
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Direct Line: <strong>+91 7083246105</strong> • Email: <strong>Rushikesh977@gmail.com</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+917083246105"
                className="px-4 py-2 bg-white text-emerald-900 font-extrabold rounded-xl text-xs hover:bg-emerald-50 transition-colors"
              >
                Call: 7083246105
              </a>
              <a
                href="mailto:Rushikesh977@gmail.com"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs transition-colors border border-emerald-600"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <img src={logo1} alt="Khet Sathi" className="w-6 h-6 object-contain" />
              <span className="font-bold text-slate-900">Khet Sathi</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>Architected & Developed by <strong className="text-slate-900 font-extrabold">Rushikesh Pawar</strong> (📞 +91 7083246105 | ✉️ Rushikesh977@gmail.com)</span>
          </div>
          <div className="flex items-center gap-4 font-semibold shrink-0">
            <Link to="/login" className="hover:text-emerald-700">Login</Link>
            <Link to="/register" className="hover:text-emerald-700">Register</Link>
            <a href="#about" className="hover:text-emerald-700">About</a>
            <a href="#support" className="hover:text-emerald-700">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
