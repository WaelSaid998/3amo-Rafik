export type CharacterEmotion = 
  | 'neutral'
  | 'hopeful'
  | 'proud'
  | 'joy'
  | 'shocked'
  | 'sad'
  | 'angry';

export type VisemeShape = 'closed' | 'slight' | 'open' | 'wide' | 'round' | 'teeth';

export type Language = 'ar' | 'fr' | 'en';

export interface StoryScene {
  id: string;
  order: number;
  iconName: 'mandate' | 'elections' | 'parliament' | 'arrest' | 'protest' | 'freedom' | 'flag';
  title: {
    ar: string;
    fr: string;
    en: string;
  };
  subtitle: {
    ar: string;
    fr: string;
    en: string;
  };
  narrative: {
    ar: string;
    fr: string;
    en: string;
  };
  yearDate: string;
  location: {
    ar: string;
    fr: string;
    en: string;
  };
  emotion: CharacterEmotion;
  bgGradient: string;
  accentColor: string;
  keyFigures?: string[];
}

export interface QuizQuestion {
  id: number;
  question: {
    ar: string;
    fr: string;
    en: string;
  };
  options: {
    ar: string[];
    fr: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: {
    ar: string;
    fr: string;
    en: string;
  };
  emotionOnSuccess: CharacterEmotion;
}

export interface AskResponse {
  answer: string;
  emotion: CharacterEmotion;
  isIndependenceTopic?: boolean;
  followUps: string[];
  isFallback?: boolean;
}
