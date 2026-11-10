import React, { useState, useEffect, useRef } from 'react';
import { CharacterEmotion, Language } from './types';
import { KioskHeader } from './components/KioskHeader';
import { StoryTheater } from './components/StoryTheater';
import { AskUncleRafiq } from './components/AskUncleRafiq';
import { FlagExplorer } from './components/FlagExplorer';
import { IndependenceQuiz } from './components/IndependenceQuiz';
import { AttractScreen } from './components/AttractScreen';
import { audioSpeech } from './utils/audioSpeech';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'story' | 'ask' | 'flag' | 'quiz'>('story');
  const [language, setLanguage] = useState<Language>('ar');
  const [currentEmotion, setCurrentEmotion] = useState<CharacterEmotion>('proud');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const idleTimerRef = useRef<number | null>(null);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Listen to fullscreenchange events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Kiosk Inactivity Reset / Attract Mode (85 seconds of no touch in exhibition)
  const resetIdleTimer = () => {
    if (isIdle) {
      setIsIdle(false);
    }
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
      audioSpeech.stop();
    }, 85000);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetIdleTimer));
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const handleToggleFullscreen = () => {
    audioSpeech.playSoundEffect('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSpeech.setMuted(nextMuted);
  };

  const handleLanguageChange = (lang: Language) => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    setLanguage(lang);
    // Update HTML dir and lang
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Subtle ambient background color adaptation according to emotion
  const getAmbientBgStyle = () => {
    switch (currentEmotion) {
      case 'joy':
        return 'radial-gradient(circle at 50% 20%, #14532d 0%, #062414 45%, #09090b 100%)';
      case 'proud':
        return 'radial-gradient(circle at 50% 20%, #7f1d1d 0%, #2b0b0b 45%, #09090b 100%)';
      case 'hopeful':
        return 'radial-gradient(circle at 50% 20%, #78350f 0%, #271206 45%, #09090b 100%)';
      case 'shocked':
        return 'radial-gradient(circle at 50% 20%, #451a1a 0%, #1e0b0b 45%, #09090b 100%)';
      case 'sad':
        return 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 45%, #09090b 100%)';
      case 'angry':
        return 'radial-gradient(circle at 50% 20%, #701a0e 0%, #300c07 45%, #09090b 100%)';
      case 'neutral':
      default:
        return 'radial-gradient(circle at 50% 20%, #292524 0%, #141210 45%, #09090b 100%)';
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col text-stone-100 transition-all duration-1000 select-none"
      style={{
        background: getAmbientBgStyle(),
      }}
    >
      {/* Decorative Traditional Arch & Cedar Watermark in background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-[85vw] h-[85vh]">
          {/* Lebanese Cedar Silhouette */}
          <polygon points="400,100 240,300 560,300" fill="#ffffff" />
          <polygon points="400,240 200,460 600,460" fill="#ffffff" />
          <polygon points="400,380 160,620 640,620" fill="#ffffff" />
          <rect x="365" y="620" width="70" height="90" fill="#ffffff" />
        </svg>
      </div>

      {/* Kiosk Top Header */}
      <KioskHeader
        currentTab={currentTab}
        onSelectTab={(tab) => {
          audioSpeech.stop();
          setCurrentTab(tab);
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* Main Kiosk Content Area */}
      <main className="flex-1 w-full relative overflow-hidden">
        {currentTab === 'story' && (
          <StoryTheater
            language={language}
            reducedMotion={reducedMotion}
            onEmotionChange={setCurrentEmotion}
          />
        )}

        {currentTab === 'ask' && (
          <AskUncleRafiq
            language={language}
            reducedMotion={reducedMotion}
            onEmotionChange={setCurrentEmotion}
          />
        )}

        {currentTab === 'flag' && (
          <FlagExplorer
            language={language}
            reducedMotion={reducedMotion}
            onEmotionChange={setCurrentEmotion}
          />
        )}

        {currentTab === 'quiz' && (
          <IndependenceQuiz
            language={language}
            reducedMotion={reducedMotion}
            onEmotionChange={setCurrentEmotion}
          />
        )}
      </main>

      {/* Attract Screen (Shown when kiosk is idle) */}
      {isIdle && (
        <AttractScreen
          onDismiss={() => {
            setIsIdle(false);
            audioSpeech.playSoundEffect('click');
          }}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  );
}
