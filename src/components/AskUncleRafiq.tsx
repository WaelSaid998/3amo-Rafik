import React, { useState, useEffect, useRef } from 'react';
import { CharacterEmotion, Language, VisemeShape, AskResponse } from '../types';
import { StorytellerCharacter } from './StorytellerCharacter';
import { audioSpeech } from '../utils/audioSpeech';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  Square, 
  HelpCircle, 
  RefreshCw, 
  RotateCw,
  User, 
  Bot, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface AskUncleRafiqProps {
  language: Language;
  reducedMotion: boolean;
  onEmotionChange?: (emotion: CharacterEmotion) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'rafiq';
  text: string;
  emotion?: CharacterEmotion;
  timestamp: string;
  followUps?: string[];
}

const QUESTION_SETS = [
  [
    'من صنع هذا الكشك وبرمج عمّو رفيق؟',
    'من هو أول رئيس لجمهورية لبنان المستقل؟',
    'ماذا حدث في قلعة راشيا فجر 11 تشرين الثاني؟',
    'كيف رُسم أول علم لبناني في منزل صائب سلام؟'
  ],
  [
    'من كان أول رئيس حكومة للبنان 1943؟',
    'ما هو دور حكومة بشامون والأمير مجيد أرسلان؟',
    'ماذا ترمز ألوان العلم وشجرة الأرز؟',
    'كيف شاركت نساء لبنان في مظاهرات الاستقلال؟'
  ],
  [
    'لماذا نحتفل في اثنين وعشرين تشرين الثاني تحديداً؟',
    'لماذا تم تعديل الدستور اللبناني في 8 تشرين؟',
    'متى تم جلاء آخر جندي فرنسي عام 1946؟',
    'من كتب ولحن النشيد الوطني اللبناني؟'
  ]
];

export const AskUncleRafiq: React.FC<AskUncleRafiqProps> = ({
  language,
  reducedMotion,
  onEmotionChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [characterEmotion, setCharacterEmotion] = useState<CharacterEmotion>('proud');
  const [currentViseme, setCurrentViseme] = useState<VisemeShape>('slight');
  const [questionSetIndex, setQuestionSetIndex] = useState(0);

  // Live conversation thread history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'rafiq',
      text: 'يا أهلاً وسهلاً بكم في كشك استقلال لبنان! أنا عمّو رفيق الحكواتي، تم صنعي وبرمجتي بكل فخر ومحبة من قبل وائل وفراس! اسألوني أي سؤال عن ملحمة اثنين وعشرين تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين وبطولات أجدادنا، وسأجيبكم فوراً!',
      emotion: 'joy',
      timestamp: 'الآن',
      followUps: [
        'من صنع هذا الكشك وبرمج عمّو رفيق؟',
        'من هو أول رئيس لجمهورية لبنان المستقل؟',
        'ماذا حدث في قلعة راشيا فجر 11 تشرين الثاني؟'
      ]
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message at the bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isLoading]);

  const handleStopAudio = () => {
    audioSpeech.playSoundEffect('click');
    audioSpeech.stop();
    setIsSpeaking(false);
    setCurrentViseme('slight');
  };

  const toggleMic = async () => {
    audioSpeech.playSoundEffect('click');
    if (isSpeaking) {
      handleStopAudio();
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    setMicErrorMessage(null);

    // 1. Request microphone hardware access
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close temporary stream immediately
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err: any) {
      console.warn('getUserMedia permission error:', err);
      setMicErrorMessage('يرجى السماح بصلاحية الميكروفون في المتصفح أو لمس أحد الأسئلة المقترحة.');
      setTimeout(() => setMicErrorMessage(null), 5000);
      return;
    }

    // 2. Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicErrorMessage('التعرف الصوتي غير مدعوم في متصفحك. يمكنك النقر على أي سؤال أو الكتابة.');
      setTimeout(() => setMicErrorMessage(null), 5000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'ar' ? 'ar-LB' : language === 'fr' ? 'fr-FR' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          setInputText(interimTranscript);
        }

        if (finalTranscript && finalTranscript.trim()) {
          setInputText(finalTranscript.trim());
          handleSubmitQuestion(finalTranscript.trim());
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicErrorMessage('تم حظر الميكروفون من المتصفح. يمكنك اختيار أي سؤال من القائمة أدناه!');
        } else if (event.error === 'no-speech') {
          setMicErrorMessage('لم نسمع أي صوت، يرجى التحدث بصوت أوضح وقريب من الميكروفون.');
        } else {
          setMicErrorMessage('تعذر التقاط الصوت، يمكنك لمس أي سؤال أو كتابته.');
        }
        setTimeout(() => setMicErrorMessage(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setMicErrorMessage('تعذر بدء التسجيل، يمكنك لمس أي سؤال مقترح بالأسفل.');
      setTimeout(() => setMicErrorMessage(null), 5000);
    }
  };

  const speakAnswer = (text: string, emotion: CharacterEmotion) => {
    // If mic is active, stop it immediately to prevent echo loops
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSpeaking(true);
    audioSpeech.speak({
      text: text,
      language: language,
      emotion: emotion,
      onStart: () => setIsSpeaking(true),
      onViseme: (shape) => setCurrentViseme(shape),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentViseme('slight');
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentViseme('slight');
      }
    });
  };

  const handleSubmitQuestion = async (questionToAsk?: string) => {
    const q = (questionToAsk || inputText).trim();
    if (!q || isLoading) return;

    audioSpeech.playSoundEffect('click');
    handleStopAudio();
    setIsLoading(true);

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

    // Append User Question to thread
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: timeStr
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer');
      }

      const data: AskResponse = await res.json();
      setCharacterEmotion(data.emotion);
      onEmotionChange?.(data.emotion);

      // Append Uncle Rafiq Answer to thread
      const rafiqMsg: ChatMessage = {
        id: `rafiq-${Date.now()}`,
        sender: 'rafiq',
        text: data.answer,
        emotion: data.emotion,
        timestamp: timeStr,
        followUps: data.followUps
      };

      setChatHistory(prev => [...prev, rafiqMsg]);

      // Speak response fully in native Arabic
      speakAnswer(data.answer, data.emotion);

    } catch (err) {
      console.error('Error asking uncle rafiq:', err);
      const fallbackMsg: ChatMessage = {
        id: `rafiq-${Date.now()}`,
        sender: 'rafiq',
        text: 'في اثنين وعشرين تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين، تكللت جهود شعبنا الأبي بنيل استقلاله وطرد الانتداب بعد أن أُطلق سراح قادتنا من قلعة راشيا!',
        emotion: 'proud',
        timestamp: timeStr,
        followUps: ['من صمم العلم اللبناني؟', 'ماذا حدث في قلعة راشيا؟', 'من هم رجالات الاستقلال؟']
      };
      setChatHistory(prev => [...prev, fallbackMsg]);
      speakAnswer(fallbackMsg.text, 'proud');
    } finally {
      setIsLoading(false);
    }
  };

  const rotateQuestions = () => {
    audioSpeech.playSoundEffect('click');
    setQuestionSetIndex(prev => (prev + 1) % QUESTION_SETS.length);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 md:p-6 lg:p-8 overflow-hidden select-none">
      {/* Main Grid: Storyteller Character Stage + Live Dialogue Conversation */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center min-h-0 my-1">
        {/* Left Column: Character Stage with visual speech & emotion */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center h-full relative">
          <div className="relative">
            <StorytellerCharacter
              emotion={characterEmotion}
              viseme={currentViseme}
              isSpeaking={isSpeaking}
              reducedMotion={reducedMotion}
              onCharacterClick={() => {
                if (isSpeaking) {
                  handleStopAudio();
                } else {
                  const lastRafiq = [...chatHistory].reverse().find(m => m.sender === 'rafiq');
                  if (lastRafiq) speakAnswer(lastRafiq.text, lastRafiq.emotion || 'proud');
                }
              }}
              size="kiosk"
            />
          </div>

          {/* Voice Control Buttons (Play / STOP) */}
          <div className="mt-2 flex items-center gap-2">
            {isSpeaking ? (
              <button
                onClick={handleStopAudio}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-700/50 transition-all active:scale-95 cursor-pointer animate-pulse"
                title="إيقاف صوت الحكواتي فوراً"
              >
                <Square size={16} className="fill-current" />
                <span>إيقاف الصوت فوراً ⏹️</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const lastRafiq = [...chatHistory].reverse().find(m => m.sender === 'rafiq');
                  if (lastRafiq) speakAnswer(lastRafiq.text, lastRafiq.emotion || 'proud');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900/95 border border-stone-700 hover:border-amber-400 text-stone-100 text-xs md:text-sm font-black shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 size={16} className="text-amber-400" />
                <span>إعادة الاستماع للجواب الأخير</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Conversation Chat Stream (shows latest at the bottom) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-3 min-h-0">
          {/* Conversation Stream Box */}
          <div
            ref={chatScrollRef}
            className="bg-stone-950/85 backdrop-blur-xl border border-stone-800 rounded-3xl p-4 md:p-6 shadow-2xl flex-1 overflow-y-auto space-y-4"
          >
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2 mb-2 text-xs text-stone-400">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Sparkles size={14} />
                <span>حوار الاستقلال المباشر مع عمّو رفيق</span>
              </span>
              <span>{chatHistory.length} رسائل</span>
            </div>

            {/* Messages */}
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-stone-400">
                    {isUser ? (
                      <>
                        <span>سؤالك</span>
                        <User size={12} className="text-red-400" />
                      </>
                    ) : (
                      <>
                        <Bot size={12} className="text-amber-400" />
                        <span className="font-bold text-stone-300">عمّو رفيق الحكواتي</span>
                      </>
                    )}
                    <span className="opacity-60 text-[10px]">({msg.timestamp})</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[90%] p-4 md:p-5 rounded-2xl text-base md:text-lg leading-relaxed font-tajawal select-text ${
                      isUser
                        ? 'bg-red-700/80 text-white rounded-br-none shadow-lg'
                        : 'bg-stone-900 border border-stone-800 text-stone-100 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* If Rafiq message and has followUps, render clickable chips under it */}
                  {!isUser && msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.followUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSubmitQuestion(fu)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-stone-800/90 hover:bg-stone-700 border border-stone-700/80 hover:border-amber-400 text-stone-200 text-xs rounded-xl font-bold transition-all cursor-pointer text-right"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator inside thread */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/80 p-3 rounded-2xl w-fit animate-pulse">
                <RefreshCw size={14} className="animate-spin" />
                <span>عمّو رفيق يكتب الجواب الآن...</span>
              </div>
            )}
          </div>

          {/* Quick Dynamic Suggestion Questions with Rotation */}
          <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-2xl p-3">
            <div className="text-xs font-bold text-stone-300 mb-2 flex items-center justify-between">
              <span>أسئلة مقترحة (المس لأي سؤال مباشرة):</span>
              <button
                onClick={rotateQuestions}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold bg-stone-900 px-2 py-1 rounded-lg border border-stone-700 cursor-pointer active:scale-95"
                title="عرض مجموعة أسئلة جديدة"
              >
                <RotateCw size={12} />
                <span>أسئلة أخرى ({questionSetIndex + 1}/3)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {QUESTION_SETS[questionSetIndex].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmitQuestion(q)}
                  disabled={isLoading}
                  className="shrink-0 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-red-400 rounded-xl text-xs md:text-sm font-bold text-stone-200 hover:text-white transition-all active:scale-95 cursor-pointer max-w-[260px] truncate"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Microphone Feedback Banner if an error or status occurs */}
      {micErrorMessage && (
        <div className="w-full bg-red-950/90 border border-red-700/80 text-red-200 px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-between shadow-lg animate-fade-in my-1">
          <div className="flex items-center gap-2">
            <span className="text-base">🎙️</span>
            <span>{micErrorMessage}</span>
          </div>
          <button
            onClick={() => setMicErrorMessage(null)}
            className="text-stone-400 hover:text-white text-xs px-2 py-0.5 rounded bg-stone-900/60 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Kiosk Input Bar (Big Touch Microphone + Touch Input Box + Instant Stop Button) */}
      <div className="w-full bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-2xl p-2.5 md:p-3.5 flex items-center gap-2.5 shadow-2xl">
        {/* Large Touch Microphone Button */}
        <button
          onClick={toggleMic}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs md:text-sm transition-all active:scale-95 cursor-pointer touch-manipulation shrink-0 ${
            isListening
              ? 'bg-red-600 text-white mic-recording shadow-lg shadow-red-700/50'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700'
          }`}
          title="تحدث إلى عمّو رفيق عبر الميكروفون"
        >
          {isListening ? (
            <>
              <MicOff size={20} className="animate-pulse" />
              <span>جاري الاستماع...</span>
            </>
          ) : (
            <>
              <Mic size={20} className="text-red-400" />
              <span>تحدث بالصوت</span>
            </>
          )}
        </button>

        {/* Text Input for Typing on Touchscreen */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
            placeholder="اكتب سؤالك هنا لأبو رفيق حول استقلال لبنان 1943..."
            disabled={isLoading}
            className="w-full bg-stone-900 border border-stone-700 focus:border-red-500 rounded-2xl px-4 py-3.5 text-sm md:text-base text-stone-100 placeholder-stone-500 outline-none transition-all"
          />
        </div>

        {/* Stop Voice button if speaking */}
        {isSpeaking && (
          <button
            onClick={handleStopAudio}
            className="px-4 py-3.5 rounded-2xl bg-stone-800 hover:bg-red-950 border border-red-500 text-red-300 font-bold text-xs md:text-sm flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
            title="إيقاف الكلام فوراً"
          >
            <Square size={16} className="fill-current text-red-400" />
            <span className="hidden sm:inline">إيقاف</span>
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={() => handleSubmitQuestion()}
          disabled={!inputText.trim() || isLoading}
          className={`px-5 py-3.5 rounded-2xl font-black text-sm md:text-base flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation shrink-0 ${
            !inputText.trim() || isLoading
              ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-700/40'
          }`}
        >
          <span>إرسال</span>
          <Send size={16} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
