import React, { useState } from 'react';
import { Language, CharacterEmotion } from '../types';
import { StorytellerCharacter } from './StorytellerCharacter';
import { audioSpeech } from '../utils/audioSpeech';
import { Volume2, Sparkles, Award, Info, Heart, CheckCircle2 } from 'lucide-react';

interface FlagExplorerProps {
  language: Language;
  reducedMotion: boolean;
  onEmotionChange?: (emotion: CharacterEmotion) => void;
}

export const FlagExplorer: React.FC<FlagExplorerProps> = ({
  language,
  reducedMotion,
  onEmotionChange,
}) => {
  const [selectedPart, setSelectedPart] = useState<'red' | 'white' | 'cedar' | 'history'>('cedar');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const partDetails = {
    red: {
      title: 'الشريطان الأحمران (دماء الشهداء)',
      desc: 'يمثل الشريطان الأحمران في أعلى وأسفل العلم دماء الشهداء الأبرار والتضحيات الجسيمة التي بذلها اللبنانيون عبر العصور لنيل الحرية والسيادة الوطنية وكسر قيود الاحتلال.',
      symbol: 'التضحية والشجاعة والكرامة الوطنية',
      emotion: 'proud' as CharacterEmotion,
    },
    white: {
      title: 'المساحة البيضاء (السلام ونقاء الثلوج)',
      desc: 'تمثل المساحة البيضاء في الوسط بياض الثلج الأبدي الناصع الذي يكلل قمم جبل صنين وجبال الأرز، كما ترمز للسلام والوفاق والنية الصافية والوحدة بين جميع أبناء الوطن الواحد.',
      symbol: 'السلام والنقاء والوحدة الوطنية',
      emotion: 'hopeful' as CharacterEmotion,
    },
    cedar: {
      title: 'شجرة الأرز الخضراء (الخلود والصمود)',
      desc: 'تتوسط العلم شجرة الأرز اللبنانية الخالدة، التي تغرس جذورها عميقاً في صخور جبالنا. تمثل الخلود، والشموخ، والصلابة في وجه العواصف، والبركة المذكورة في الكتب السماوية منذ آلاف السنين.',
      symbol: 'الخلود والشموخ والاستمرارية',
      emotion: 'joy' as CharacterEmotion,
    },
    history: {
      title: 'قصة الرسم الأول في 11 تشرين الثاني 1943',
      desc: 'بينما كانت قوات الانتداب تحاصر البرلمان، اجتمع النواب الأحرار في منزل صائب سلام ورسموا بأيديهم أول علم لبناني مستقل على قطعة قماش بيضاء وحمراء، ووقّع عليه النواب الحاضرون معلنين ولادة راية الوطن الحرة!',
      symbol: 'وثيقة ميلاد الجمهورية المستقلة',
      emotion: 'proud' as CharacterEmotion,
    }
  };

  const current = partDetails[selectedPart];

  const handleSelectPart = (part: 'red' | 'white' | 'cedar' | 'history') => {
    audioSpeech.playSoundEffect('click');
    setSelectedPart(part);
    const detail = partDetails[part];
    onEmotionChange?.(detail.emotion);

    audioSpeech.speak({
      text: `${detail.title}. ${detail.desc}`,
      language: language,
      emotion: detail.emotion,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-100 font-tajawal">
              اكتشف علم استقلال لبنان 1943 🇱🇧
            </h2>
            <p className="text-xs md:text-sm text-stone-400">
              المس أجزاء العلم لتتعرف على معانيها العميقة وقصة رسمه باليد
            </p>
          </div>
        </div>

        {/* Listen Button */}
        <button
          onClick={() => handleSelectPart(selectedPart)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs md:text-sm transition-all cursor-pointer active:scale-95 shadow-md"
        >
          <Volume2 size={16} />
          <span>استمع للشرح</span>
        </button>
      </div>

      {/* Main Grid: Interactive Flag on Left, Meaning & Character on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4 min-h-0">
        {/* Flag Interactive Area (Left / Center) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* THE LEBANESE FLAG (Touchable SVG with High Quality Proportions) */}
          <div className="relative w-full max-w-xl aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/40 p-1 bg-stone-900">
            <svg
              viewBox="0 0 600 400"
              className="w-full h-full rounded-2xl cursor-pointer select-none"
            >
              {/* Top Red Stripe */}
              <rect
                x="0"
                y="0"
                width="600"
                height="100"
                fill="#dc2626"
                onClick={() => handleSelectPart('red')}
                className={`transition-opacity cursor-pointer ${
                  selectedPart === 'red' ? 'opacity-100 stroke-4 stroke-white' : 'opacity-90 hover:opacity-100'
                }`}
              />

              {/* White Middle Stripe */}
              <rect
                x="0"
                y="100"
                width="600"
                height="200"
                fill="#ffffff"
                onClick={() => handleSelectPart('white')}
                className={`transition-opacity cursor-pointer ${
                  selectedPart === 'white' ? 'opacity-100 stroke-4 stroke-amber-400' : 'opacity-95 hover:opacity-100'
                }`}
              />

              {/* Bottom Red Stripe */}
              <rect
                x="0"
                y="300"
                width="600"
                height="100"
                fill="#dc2626"
                onClick={() => handleSelectPart('red')}
                className={`transition-opacity cursor-pointer ${
                  selectedPart === 'red' ? 'opacity-100 stroke-4 stroke-white' : 'opacity-90 hover:opacity-100'
                }`}
              />

              {/* Sacred Green Cedar Tree (الأرزة اللبنانية الشامخة) */}
              <g
                id="cedar-tree"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPart('cedar');
                }}
                className={`cursor-pointer transition-transform duration-300 ${
                  selectedPart === 'cedar' ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{ transformOrigin: '300px 200px' }}
              >
                {/* Cedar Trunk */}
                <path d="M 293 250 L 307 250 L 305 285 L 295 285 Z" fill="#15803d" />

                {/* Tier 1 (Base Branches) */}
                <polygon
                  points="300,180 230,265 370,265"
                  fill="#16a34a"
                  filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                />

                {/* Tier 2 (Middle Branches) */}
                <polygon
                  points="300,145 245,215 355,215"
                  fill="#15803d"
                  filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                />

                {/* Tier 3 (Top Crown) */}
                <polygon
                  points="300,115 260,165 340,165"
                  fill="#14532d"
                  filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                />

                {/* Star sparkle on cedar if selected */}
                {selectedPart === 'cedar' && (
                  <circle cx="300" cy="115" r="4" fill="#facc15" className="animate-ping" />
                )}
              </g>
            </svg>

            {/* Click hints overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-1.5 bg-stone-950/80 backdrop-blur-md rounded-xl text-[11px] text-stone-300 border border-stone-800 pointer-events-none">
              <span>👈 انقر على الأحمر</span>
              <span>🌲 انقر على الأرزة</span>
              <span>⚪ انقر على الأبيض</span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
            <button
              onClick={() => handleSelectPart('red')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedPart === 'red'
                  ? 'bg-red-700 text-white border-red-400 shadow-lg shadow-red-900/50 scale-105'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              <span>الأحمر: دماء الشهداء</span>
            </button>

            <button
              onClick={() => handleSelectPart('white')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedPart === 'white'
                  ? 'bg-stone-100 text-stone-950 border-white shadow-lg scale-105'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-white inline-block border border-stone-400"></span>
              <span>الأبيض: السلام والثلج</span>
            </button>

            <button
              onClick={() => handleSelectPart('cedar')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedPart === 'cedar'
                  ? 'bg-emerald-700 text-white border-emerald-400 shadow-lg shadow-emerald-900/50 scale-105'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>الأرزة: الخلود والشموخ</span>
            </button>

            <button
              onClick={() => handleSelectPart('history')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedPart === 'history'
                  ? 'bg-amber-600 text-white border-amber-300 shadow-lg scale-105'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
              }`}
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>قصة العلم 1943</span>
            </button>
          </div>
        </div>

        {/* Right Info Box with Storyteller Response */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 h-full">
          {/* Character Preview */}
          <div className="flex items-center justify-center">
            <StorytellerCharacter
              emotion={current.emotion}
              viseme={isSpeaking ? 'open' : 'slight'}
              isSpeaking={isSpeaking}
              reducedMotion={reducedMotion}
              onCharacterClick={() => handleSelectPart(selectedPart)}
              size="md"
            />
          </div>

          {/* Explanation Card */}
          <div className="bg-stone-950/85 backdrop-blur-xl border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 mb-1">
              <CheckCircle2 size={16} />
              <span>{current.symbol}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-stone-100 font-tajawal mb-2">
              {current.title}
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-stone-300 font-tajawal">
              {current.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
