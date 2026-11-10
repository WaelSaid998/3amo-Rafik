import React from 'react';
import { Language } from '../types';
import { Volume2, VolumeX, Maximize2, Minimize2, Globe, Sparkles, BookOpen, MessageSquare, Flag, Trophy, Eye } from 'lucide-react';
import { audioSpeech } from '../utils/audioSpeech';

interface KioskHeaderProps {
  currentTab: 'story' | 'ask' | 'flag' | 'quiz';
  onSelectTab: (tab: 'story' | 'ask' | 'flag' | 'quiz') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const tabs = [
    { id: 'story', label: 'قصة الاستقلال', icon: BookOpen },
    { id: 'ask', label: 'اسأل عمّو رفيق', icon: MessageSquare },
    { id: 'flag', label: 'علم 1943', icon: Flag },
    { id: 'quiz', label: 'تحدي الأبطال', icon: Trophy },
  ] as const;

  const handleTabClick = (tabId: 'story' | 'ask' | 'flag' | 'quiz') => {
    audioSpeech.playSoundEffect('click');
    onSelectTab(tabId);
  };

  return (
    <header className="w-full bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/80 px-4 md:px-6 py-3 flex items-center justify-between gap-4 z-40 select-none">
      {/* Brand & Independence Badge */}
      <div className="flex items-center gap-3">
        {/* Animated Cedar Icon */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-lg shadow-red-900/40 flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
            {/* Lebanese Cedar SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="12,3 6,10 18,10" fill="#16a34a" />
              <polygon points="12,8 4,16 20,16" fill="#15803d" />
              <polygon points="12,13 5,20 19,20" fill="#166534" />
              <rect x="10.5" y="20" width="3" height="3" fill="#78350f" />
            </svg>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-xl font-black text-stone-100 font-tajawal tracking-tight">
              عيد استقلال لبنان
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] md:text-xs font-black">
              22 تشرين الثاني
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-amber-400/90 font-medium hidden sm:block">
            كشك تفاعلي رقمي • الحكواتي أبو رفيق
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs (Large Touch Buttons for Kiosk) */}
      <nav className="flex items-center gap-1.5 md:gap-2 bg-stone-900/90 p-1 rounded-2xl border border-stone-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer touch-manipulation ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-700/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Icon size={17} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Tools (Mute, Fullscreen, Language, Accessibility) */}
      <div className="flex items-center gap-2">
        {/* Language selector toggle */}
        <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 text-xs font-bold text-stone-300">
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-2 py-1 rounded-lg transition-all ${
              language === 'ar' ? 'bg-stone-800 text-amber-300' : 'text-stone-400'
            }`}
          >
            عربي
          </button>
          <button
            onClick={() => onLanguageChange('fr')}
            className={`px-2 py-1 rounded-lg transition-all ${
              language === 'fr' ? 'bg-stone-800 text-amber-300' : 'text-stone-400'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-lg transition-all ${
              language === 'en' ? 'bg-stone-800 text-amber-300' : 'text-stone-400'
            }`}
          >
            EN
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <button
          onClick={onToggleReducedMotion}
          title={reducedMotion ? 'تفعيل الحركة' : 'تقليل الحركة (إمكانية الوصول)'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            reducedMotion
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <Eye size={18} />
        </button>

        {/* Sound Mute/Unmute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-950/60 text-red-400 border border-red-800'
              : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
          }`}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة للكشك'}
          className="w-10 h-10 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </header>
  );
};
