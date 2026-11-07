import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Layers, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  Package, 
  GitFork, 
  Scan, 
  Wallet, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewOrder: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  isSpeaking,
  onToggleSpeech,
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'orders', label: t.orders, icon: Package },
    { id: 'allocator', label: t.allocator, icon: GitFork },
    { id: 'qc', label: t.qc, icon: Scan },
    { id: 'passbook', label: t.passbook, icon: Wallet },
    { id: 'members', label: t.members, icon: Users },
    { id: 'buyerPortal', label: t.buyerPortal, icon: ShieldCheck },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      {/* Top NRLM & Language Bar */}
      <div className="bg-stone-900 text-stone-100 text-xs px-4 sm:px-6 py-1.5 flex flex-wrap justify-between items-center gap-2 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white tracking-wide">{t.verifiedNrlm}</span>
          <span className="text-stone-500">/</span>
          <span className="truncate max-w-xs sm:max-w-md text-stone-300">{t.demoNotice}</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Vernacular Audio Reading Toggle */}
          <button
            onClick={onToggleSpeech}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 text-stone-950 font-bold animate-pulse'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
            title="Read current page insights aloud in vernacular language"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isSpeaking ? t.stopVoice : t.listenVoice}</span>
          </button>

          <span className="text-stone-600 hidden sm:inline">|</span>

          {/* Language Switcher with Kannada */}
          <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded text-xs">
            {(['kn', 'en', 'hi'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition cursor-pointer ${
                  lang === l
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {l === 'kn' ? 'ಕನ್ನಡ' : l === 'en' ? 'EN' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 rounded-xl flex items-center justify-center text-amber-200 shadow-sm border border-amber-900/20 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 brand-font">
                {t.title}
              </h1>
              <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                ಕರ್ನಾಟಕ · Sanjeevini
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewOrder}
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-700"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t.newOrder}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 border-t border-stone-200 overflow-x-auto">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-amber-800 text-amber-950 bg-amber-100/60 font-bold shadow-2xs'
                  : 'border-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 ml-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
