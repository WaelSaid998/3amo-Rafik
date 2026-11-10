import React from 'react';
import { StorytellerCharacter } from './StorytellerCharacter';
import { Sparkles, Hand, Play } from 'lucide-react';

interface AttractScreenProps {
  onDismiss: () => void;
  reducedMotion: boolean;
}

export const AttractScreen: React.FC<AttractScreenProps> = ({ onDismiss, reducedMotion }) => {
  return (
    <div
      onClick={onDismiss}
      className="absolute inset-0 z-50 bg-stone-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 cursor-pointer select-none text-center animate-fade-in"
    >
      {/* Ambient glowing radial backdrop */}
      <div className="absolute inset-0 bg-radial from-red-600/20 via-transparent to-stone-950 pointer-events-none" />

      {/* Top Festival Ribbon */}
      <div className="mb-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-600/90 text-white font-black text-sm md:text-base shadow-xl shadow-red-700/50">
        <Sparkles size={18} className="text-amber-300" />
        <span>22 تشرين الثاني • ذكرى استقلال لبنان المجيد 🇱🇧</span>
      </div>

      {/* Storyteller Character Welcoming */}
      <div className="my-2">
        <StorytellerCharacter
          emotion="joy"
          viseme="open"
          isSpeaking={false}
          reducedMotion={reducedMotion}
          size="kiosk"
        />
      </div>

      {/* Welcoming Call to Action for Visitors */}
      <div className="max-w-xl space-y-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-stone-100 font-tajawal drop-shadow-lg">
          أهلاً بكم في كشك الاستقلال!
        </h2>
        <p className="text-lg md:text-2xl text-amber-300 font-tajawal font-bold">
          «تعالوا نستمع إلى قصة الأبطال في قلعة راشيا وكيف وُلد لبنان الحر!»
        </p>

        {/* Pulsing Touch Indicator Button */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-3 px-8 py-5 rounded-3xl bg-red-600 hover:bg-red-500 text-white font-black text-xl shadow-2xl shadow-red-700/60 active:scale-95 transition-all animate-bounce">
            <Hand size={28} />
            <span>المس الشاشة للبدء</span>
          </div>
        </div>

        {/* Creator Attribution */}
        <div className="pt-2 text-xs md:text-sm text-stone-400 font-bold">
          <span>تم الصنع والتطوير بكل فخر من قبل </span>
          <span className="text-amber-400 font-black">وائل وفراس</span>
        </div>
      </div>
    </div>
  );
};
