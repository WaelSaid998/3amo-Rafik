import React, { useState } from 'react';
import { Language, CharacterEmotion, VisemeShape } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { StorytellerCharacter } from './StorytellerCharacter';
import { audioSpeech } from '../utils/audioSpeech';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, Sparkles, Star } from 'lucide-react';

interface IndependenceQuizProps {
  language: Language;
  reducedMotion: boolean;
  onEmotionChange?: (emotion: CharacterEmotion) => void;
}

export const IndependenceQuiz: React.FC<IndependenceQuizProps> = ({
  language,
  reducedMotion,
  onEmotionChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<CharacterEmotion>('hopeful');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    audioSpeech.playSoundEffect('click');
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCharacterEmotion('joy');
      onEmotionChange?.('joy');
      audioSpeech.playSoundEffect('success');

      audioSpeech.speak({
        text: question.explanation[language] || question.explanation.ar,
        language: language,
        emotion: 'joy',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } else {
      setCharacterEmotion('sad');
      onEmotionChange?.('sad');

      audioSpeech.speak({
        text: `لا بأس يا بني، الإجابة الصحيحة هي: ${question.options[language][question.correctIndex]}. ${question.explanation[language] || question.explanation.ar}`,
        language: language,
        emotion: 'hopeful',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const handleNextQuestion = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setCharacterEmotion('hopeful');
      onEmotionChange?.('hopeful');
    } else {
      setIsFinished(true);
      setCharacterEmotion('proud');
      onEmotionChange?.('proud');
      audioSpeech.playSoundEffect('trumpet');

      audioSpeech.speak({
        text: `ما شاء الله عليك يا بطل! لقد أتممت تحدي استقلال لبنان بنتيجة ${score + (selectedOption === question.correctIndex ? 1 : 0)} من أصل ${QUIZ_QUESTIONS.length}! تستحق وسام الاستقلال بجدارة!`,
        language: language,
        emotion: 'joy',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      });
    }
  };

  const handleRestart = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setCharacterEmotion('hopeful');
    onEmotionChange?.('hopeful');
  };

  // If Finished: Show Certificate / Medal Badge
  if (isFinished) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="max-w-2xl w-full bg-stone-950/90 backdrop-blur-2xl border-2 border-amber-500/50 rounded-3xl p-8 shadow-2xl relative">
          {/* Confetti / Star Decor */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 shadow-lg border border-amber-500/30">
            <Trophy size={44} />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-stone-100 font-tajawal mb-2">
            مبارك! أنت بطل الاستقلال 🇱🇧
          </h2>
          <p className="text-amber-400 font-bold text-lg mb-6">
            حققت {score} إجابات صحيحة من أصل {QUIZ_QUESTIONS.length}
          </p>

          {/* Certificate Badge Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
              <Star size={20} className="fill-current" />
              <span className="text-sm font-bold tracking-widest uppercase text-stone-300">
                وسام المعرفة الوطنية اللبنانية
              </span>
              <Star size={20} className="fill-current" />
            </div>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              «تقديراً لمعرفتك التاريخية العميقة بملحمة استقلال لبنان عام 1943 وبطولات رجالات الأرز في قلعة راشيا وبشامون»
            </p>
          </div>

          {/* Replay Quiz Button */}
          <button
            onClick={handleRestart}
            className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-lg flex items-center justify-center gap-3 mx-auto shadow-xl shadow-red-700/40 transition-all active:scale-95 cursor-pointer touch-manipulation"
          >
            <RotateCcw size={22} />
            <span>خوض التحدي مرة أخرى</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-100 font-tajawal">
              تحدّي أبطال الاستقلال 🇱🇧
            </h2>
            <p className="text-xs md:text-sm text-stone-400">
              اختبر معلوماتك التاريخية واكسب وسام الاستقلال!
            </p>
          </div>
        </div>

        {/* Question Counter Pill */}
        <div className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 font-black text-sm flex items-center gap-2">
          <span>السؤال</span>
          <span className="text-amber-400 text-base">{currentIndex + 1}</span>
          <span>من {QUIZ_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Main Grid: Question & Options on Right, Storyteller on Left */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-3 min-h-0">
        {/* Character Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center h-full">
          <StorytellerCharacter
            emotion={characterEmotion}
            viseme={isSpeaking ? 'open' : 'slight'}
            isSpeaking={isSpeaking}
            reducedMotion={reducedMotion}
            size="kiosk"
          />
        </div>

        {/* Question & Big Touch Answers Card */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4 h-full">
          <div className="bg-stone-950/85 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Question Text */}
            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-stone-100 font-tajawal leading-relaxed mb-6">
              {question.question[language] || question.question.ar}
            </h3>

            {/* Multiple Choice Option Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {(question.options[language] || question.options.ar).map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === question.correctIndex;

                let btnStyle = 'bg-stone-900/90 border-stone-700/80 text-stone-200 hover:bg-stone-800/90';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-900/40';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-950/90 border-red-500 text-red-200';
                  } else {
                    btnStyle = 'bg-stone-900/40 border-stone-800/60 text-stone-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswered}
                    className={`p-4 md:p-5 rounded-2xl border text-right font-tajawal font-bold text-base md:text-lg flex items-center justify-between gap-3 transition-all touch-manipulation cursor-pointer active:scale-98 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-sm font-black text-stone-300 shrink-0">
                        {oIdx === 0 ? 'أ' : oIdx === 1 ? 'ب' : oIdx === 2 ? 'ج' : 'د'}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle size={24} className="text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={24} className="text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Display after answer */}
            {isAnswered && (
              <div className="mt-5 p-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 text-sm md:text-base font-medium flex items-center justify-between gap-4">
                <p className="flex-1">
                  {question.explanation[language] || question.explanation.ar}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm md:text-base flex items-center gap-2 shadow-lg shadow-red-700/40 shrink-0 transition-all active:scale-95 cursor-pointer touch-manipulation"
                >
                  <span>السؤال التالي</span>
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
