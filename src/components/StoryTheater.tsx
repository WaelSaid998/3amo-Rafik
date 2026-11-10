import React, { useState, useEffect, useRef } from 'react';
import { StoryScene, Language, CharacterEmotion, VisemeShape } from '../types';
import { STORY_SCENES } from '../data/storyData';
import { StorytellerCharacter } from './StorytellerCharacter';
import { SceneIcon } from './SceneIcons';
import { audioSpeech } from '../utils/audioSpeech';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Volume2, Sparkles, MapPin, Calendar, Users } from 'lucide-react';

interface StoryTheaterProps {
  language: Language;
  reducedMotion: boolean;
  onEmotionChange?: (emotion: CharacterEmotion) => void;
  onSelectScene?: (index: number) => void;
}

export const StoryTheater: React.FC<StoryTheaterProps> = ({
  language,
  reducedMotion,
  onEmotionChange,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentViseme, setCurrentViseme] = useState<VisemeShape>('slight');
  const [activeCharIndex, setActiveCharIndex] = useState<number>(-1);
  const [activeWordLength, setActiveWordLength] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const scene = STORY_SCENES[currentSceneIndex];

  // Notify parent of emotion
  useEffect(() => {
    onEmotionChange?.(scene.emotion);
  }, [scene.emotion, onEmotionChange]);

  // Handle scene change and audio trigger
  const playSceneAudio = (index: number) => {
    const targetScene = STORY_SCENES[index];
    const textToSpeak = targetScene.narrative[language] || targetScene.narrative.ar;

    setIsPlaying(true);
    setActiveCharIndex(-1);

    audioSpeech.speak({
      text: textToSpeak,
      language: language,
      emotion: targetScene.emotion,
      onStart: () => {
        setIsPlaying(true);
      },
      onWordBoundary: (charIndex, length) => {
        setActiveCharIndex(charIndex);
        setActiveWordLength(length);
      },
      onViseme: (shape) => {
        setCurrentViseme(shape);
      },
      onEnd: () => {
        setIsPlaying(false);
        setCurrentViseme('slight');
        setActiveCharIndex(-1);

        // Auto advance to next scene if enabled
        if (autoAdvance && index < STORY_SCENES.length - 1) {
          setTimeout(() => {
            handleNextScene();
          }, 1800);
        }
      },
      onError: () => {
        setIsPlaying(false);
        setCurrentViseme('slight');
      }
    });
  };

  const handleTogglePlay = () => {
    audioSpeech.playSoundEffect('click');
    if (isPlaying) {
      audioSpeech.stop();
      setIsPlaying(false);
      setCurrentViseme('slight');
    } else {
      playSceneAudio(currentSceneIndex);
    }
  };

  const handleNextScene = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    if (currentSceneIndex < STORY_SCENES.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      playSceneAudio(nextIdx);
    }
  };

  const handlePrevScene = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIdx);
      playSceneAudio(prevIdx);
    }
  };

  const handleSelectScene = (index: number) => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    setCurrentSceneIndex(index);
    playSceneAudio(index);
  };

  const handleReplay = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    playSceneAudio(currentSceneIndex);
  };

  // Translate emotion name for visual feedback
  const getEmotionLabel = (emotion: CharacterEmotion) => {
    const labels: Record<CharacterEmotion, { ar: string; fr: string; en: string; icon: string }> = {
      neutral: { ar: 'انفعال هادئ ومتزن', fr: 'Neutre et posé', en: 'Calm & Steady', icon: '⚖️' },
      hopeful: { ar: 'تفاؤل وأمل وطني', fr: 'Espoir patriotique', en: 'Patriotic Hope', icon: '🌅' },
      proud: { ar: 'فخر واعتزاز بالسيادة', fr: 'Fierté et souveraineté', en: 'National Pride', icon: '🌲' },
      joy: { ar: 'فرح غامر وانتصار!', fr: 'Joie immense et victoire!', en: 'Boundless Joy & Victory!', icon: '🎉' },
      shocked: { ar: 'دهشة وغدر الفجر!', fr: 'Stupéfaction et trahison!', en: 'Shock & Outrage!', icon: '⚡' },
      sad: { ar: 'حزن ومعاناة الانتداب', fr: 'Tristesse sous le mandat', en: 'Sorrow under Mandate', icon: '🌧️' },
      angry: { ar: 'غضب وتحدٍ شعبي صامد!', fr: 'Colère et défi populaire!', en: 'Defiance & Anger!', icon: '🔥' },
    };
    return labels[emotion] || labels.neutral;
  };

  const emotionInfo = getEmotionLabel(scene.emotion);
  const narrativeText = scene.narrative[language] || scene.narrative.ar;

  // Render Subtitles with karaoke word highlighting
  const renderSubtitles = () => {
    if (activeCharIndex < 0) {
      return <span>{narrativeText}</span>;
    }

    const before = narrativeText.slice(0, activeCharIndex);
    const highlighted = narrativeText.slice(activeCharIndex, activeCharIndex + activeWordLength);
    const after = narrativeText.slice(activeCharIndex + activeWordLength);

    return (
      <span>
        <span className="text-stone-300">{before}</span>
        <span className="bg-amber-400 text-stone-950 font-black px-1.5 py-0.5 rounded shadow-md transition-all">
          {highlighted}
        </span>
        <span className="text-stone-300">{after}</span>
      </span>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Top Scene Timeline / Indicator */}
      <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STORY_SCENES.map((s, idx) => {
          const isActive = idx === currentSceneIndex;
          const isPassed = idx < currentSceneIndex;
          return (
            <button
              key={s.id}
              onClick={() => handleSelectScene(idx)}
              className={`flex-1 min-w-[120px] max-w-[180px] p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer touch-manipulation text-right ${
                isActive
                  ? 'bg-red-700/80 border-red-400 text-white shadow-lg shadow-red-900/40 scale-105'
                  : isPassed
                  ? 'bg-stone-800/80 border-emerald-600/50 text-stone-300 hover:bg-stone-800'
                  : 'bg-stone-900/60 border-stone-700/60 text-stone-400 hover:bg-stone-800/70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white text-red-700' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <SceneIcon name={s.iconName} size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">
                  {idx + 1}. {s.title[language] || s.title.ar}
                </span>
                <span className="text-[10px] opacity-75 truncate">{s.yearDate}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Stage: Character + Animated Story Display */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-3 min-h-0">
        {/* Left Column (Character Stage) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center h-full relative">
          <div className="relative">
            {/* Ambient cedar glow effect behind character */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: scene.accentColor }}
            />

            <StorytellerCharacter
              emotion={scene.emotion}
              viseme={currentViseme}
              isSpeaking={isPlaying}
              reducedMotion={reducedMotion}
              onCharacterClick={handleTogglePlay}
              size="kiosk"
            />
          </div>

          {/* Active Emotion Badge */}
          <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/80 border border-stone-700 backdrop-blur-md shadow-md text-stone-200 text-xs md:text-sm font-medium">
            <span className="text-base">{emotionInfo.icon}</span>
            <span>{emotionInfo[language] || emotionInfo.ar}</span>
          </div>
        </div>

        {/* Right Column: Historical Narrative Card for Kiosk Viewers */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full space-y-4">
          <div className="bg-stone-950/70 backdrop-blur-xl border border-stone-800/90 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative Top Accent Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-2 transition-all duration-700"
              style={{ backgroundColor: scene.accentColor }}
            />

            {/* Header: Scene Number, Icon & Meta */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-colors"
                  style={{ backgroundColor: `${scene.accentColor}25`, color: scene.accentColor }}
                >
                  <SceneIcon name={scene.iconName} size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-red-600 text-white uppercase tracking-wider">
                      المشهد {scene.order} من 7
                    </span>
                    <span className="text-stone-400 text-xs flex items-center gap-1">
                      <Calendar size={13} className="text-amber-400" />
                      {scene.yearDate}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-100 font-tajawal mt-1">
                    {scene.title[language] || scene.title.ar}
                  </h2>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end text-xs text-stone-400">
                <span className="flex items-center gap-1 font-semibold text-stone-300">
                  <MapPin size={13} className="text-red-400" />
                  {scene.location[language] || scene.location.ar}
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-amber-300 font-bold text-sm md:text-base mb-3">
              {scene.subtitle[language] || scene.subtitle.ar}
            </p>

            {/* Spoken Narrative with Karaoke Highlighting */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-inner min-h-[140px] flex items-center">
              <p className="text-lg md:text-2xl leading-relaxed font-medium text-stone-100 font-tajawal select-text">
                {renderSubtitles()}
              </p>
            </div>

            {/* Key Figures badges if present */}
            {scene.keyFigures && scene.keyFigures.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-800/80 text-xs text-stone-400 overflow-x-auto">
                <Users size={14} className="text-emerald-400 shrink-0" />
                <span className="font-bold text-stone-300 shrink-0">شخصيات المشهد:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {scene.keyFigures.map((fig, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 bg-stone-800/90 text-stone-200 rounded-lg text-xs font-medium border border-stone-700/60"
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Kiosk Controls (Big, Tactile, High-Contrast Buttons) */}
      <div className="w-full bg-stone-950/85 backdrop-blur-xl border border-stone-800/90 rounded-2xl p-3 md:p-4 flex items-center justify-between gap-4 shadow-xl">
        {/* Previous Scene Button */}
        <button
          onClick={handlePrevScene}
          disabled={currentSceneIndex === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all touch-manipulation cursor-pointer ${
            currentSceneIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-stone-900 text-stone-600'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-100 active:scale-95 shadow-md'
          }`}
        >
          <ChevronRight size={22} className="rtl:rotate-0 ltr:rotate-180" />
          <span>المشهد السابق</span>
        </button>

        {/* Center: Play/Pause, Replay & Auto-Play */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReplay}
            title="إعادة الاستماع للمشهد"
            className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer touch-manipulation"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-base md:text-lg transition-all active:scale-95 shadow-xl cursor-pointer touch-manipulation ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-700/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={24} className="fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play size={24} className="fill-current" />
                <span>استمع للحكواتي</span>
              </>
            )}
          </button>

          {/* Auto advance toggle */}
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              autoAdvance
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-stone-900 border-stone-700 text-stone-400'
            }`}
            title="التشغيل التلقائي للمشاهد المتتالية"
          >
            <Sparkles size={14} />
            <span>تشغيل متواصل</span>
          </button>
        </div>

        {/* Next Scene Button */}
        <button
          onClick={handleNextScene}
          disabled={currentSceneIndex === STORY_SCENES.length - 1}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all touch-manipulation cursor-pointer ${
            currentSceneIndex === STORY_SCENES.length - 1
              ? 'opacity-40 cursor-not-allowed bg-stone-900 text-stone-600'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-100 active:scale-95 shadow-md'
          }`}
        >
          <span>المشهد التالي</span>
          <ChevronLeft size={22} className="rtl:rotate-0 ltr:rotate-180" />
        </button>
      </div>
    </div>
  );
};
