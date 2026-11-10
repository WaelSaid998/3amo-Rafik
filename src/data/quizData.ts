import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: {
      ar: 'في أي تاريخ يحتفل لبنان رسمياً بعيد الاستقلال في كل عام؟',
      fr: 'À quelle date le Liban célèbre-t-il officiellement sa fête de l\'Indépendance ?',
      en: 'On what date does Lebanon officially celebrate its Independence Day each year?'
    },
    options: {
      ar: ['22 تشرين الثاني (نوفمبر)', '8 تشرين الثاني (نوفمبر)', '13 نيسان (أبريل)', '6 أيار (مايو)'],
      fr: ['22 novembre', '8 novembre', '13 avril', '6 mai'],
      en: ['November 22', 'November 8', 'April 13', 'May 6']
    },
    correctIndex: 0,
    explanation: {
      ar: 'أحسنت! في 22 تشرين الثاني 1943، أُطلق سراح قادة الوطن من قلعة راشيا وتوج انتصار الشعب اللبناني بالاستقلال التام!',
      fr: 'Bravo ! Le 22 novembre 1943 marque la libération des dirigeants et le triomphe de l\'Indépendance.',
      en: 'Excellent! On November 22, 1943, the national leaders were released from Rashaya Citadel, marking total independence.'
    },
    emotionOnSuccess: 'joy'
  },
  {
    id: 2,
    question: {
      ar: 'ما اسم القلعة التاريخية التي اعتقل فيها المفوض الفرنسي قادة الاستقلال؟',
      fr: 'Dans quelle forteresse historique les dirigeants furent-ils emprisonnés ?',
      en: 'In which historic fortress were the independence leaders imprisoned?'
    },
    options: {
      ar: ['قلعة راشيا الوادي', 'قلعة صيدا البحرية', 'قلعة جبيل', 'قلعة بعلبك'],
      fr: ['Citadelle de Rachaya', 'Château de Saïda', 'Château de Byblos', 'Citadelle de Baalbek'],
      en: ['Rashaya Citadel', 'Sidon Sea Castle', 'Byblos Castle', 'Baalbek Citadel']
    },
    correctIndex: 0,
    explanation: {
      ar: 'إجابة صحيحة يا بطل! قلعة راشيا في البقاع الغربي هي القلعة التي سُجن فيها بشارة الخوري ورياض الصلح ورفاقهما قبل إطلاق سراحهم.',
      fr: 'Exact ! C\'est la citadelle de Rachaya dans la Békaa où les dirigeants ont résisté avec dignité.',
      en: 'Correct! Rashaya Citadel in West Bekaa is where Bechara El Khoury and Riad El Solh were held.'
    },
    emotionOnSuccess: 'proud'
  },
  {
    id: 3,
    question: {
      ar: 'ماذا يرمز اللون الأبيض في العلم اللبناني؟',
      fr: 'Que symbolise la couleur blanche dans le drapeau libanais ?',
      en: 'What does the white color in the Lebanese flag symbolize?'
    },
    options: {
      ar: ['السلام ونقاء ثلوج جبال لبنان', 'الغيوم الصيفية', 'شواطئ البحر الأبيض', 'الحرير اللبناني'],
      fr: ['La paix et la pureté de la neige des montagnes', 'Les nuages d\'été', 'Les plages de la Méditerranée', 'La soie libanaise'],
      en: ['Peace and the pure snow of Lebanon\'s mountains', 'Summer clouds', 'Mediterranean beaches', 'Lebanese silk']
    },
    correctIndex: 0,
    explanation: {
      ar: 'ما شاء الله عليك! الأبيض يرمز للسلام الدائم ونقاء الثلج الأبيض الناصع الذي يكلل قمم جبل صنين والأرز!',
      fr: 'Parfait ! Le blanc incarne la paix et la neige immaculée des monts libanais.',
      en: 'Splendid! White symbolizes peace and the pure eternal snow crowning Mount Sannine.'
    },
    emotionOnSuccess: 'proud'
  },
  {
    id: 4,
    question: {
      ar: 'من كان أول رئيس لجمهورية لبنان في عهد الاستقلال عام 1943؟',
      fr: 'Qui fut le premier Président de la République du Liban indépendant en 1943 ?',
      en: 'Who was the first President of independent Lebanon in 1943?'
    },
    options: {
      ar: ['الشيخ بشارة الخوري', 'الأمير فخر الدين', 'رياض الصلح', 'فؤاد شهاب'],
      fr: ['Cheikh Béchara El Khoury', 'Émir Fakhreddine', 'Riyad El Solh', 'Fouad Chéhab'],
      en: ['Sheikh Bechara El Khoury', 'Emir Fakhreddine', 'Riad El Solh', 'Fouad Chehab']
    },
    correctIndex: 0,
    explanation: {
      ar: 'صحيح تماماً! انتُخب الشيخ بشارة الخوري رئيساً للجمهورية وشكّل مع رياض الصلح ركيزة الميثاق الوطني والاستقلال.',
      fr: 'Absolument ! Béchara El Khoury a été élu premier président de la République de l\'Indépendance.',
      en: 'Spot on! Sheikh Bechara El Khoury was elected the first president of independent Lebanon.'
    },
    emotionOnSuccess: 'joy'
  },
  {
    id: 5,
    question: {
      ar: 'أين تشكلت الحكومة المؤقتة التي قادت الحرس الوطني دفاعاً عن الشرعية أثناء الاعتقال؟',
      fr: 'Où le gouvernement provisoire de résistance s\'est-il établi pendant l\'arrestation ?',
      en: 'Where was the provisional resistance government established during the arrests?'
    },
    options: {
      ar: ['بلدة بشامون في الجبل', 'مدينة طرابلس', 'مدينة صور', 'مدينة زحلة'],
      fr: ['Le village de Bchamoun', 'Tripoli', 'Tyr', 'Zahlé'],
      en: ['The mountain town of Bchamoun', 'Tripoli', 'Tyre', 'Zahle']
    },
    correctIndex: 0,
    explanation: {
      ar: 'رائع جداً! حكومة بشامون بقيادة الأمير مجيد أرسلان وحبيب أبو شهلا كانت درع الاستقلال ورفعت العلم الوطني قبل الجميع!',
      fr: 'Bravo ! C\'est à Bchamoun que la résistance politique et armée s\'est organisée héroïquement.',
      en: 'Magnificent! The Bchamoun government led by Emir Majid Arslan and Habib Abou Chahla led the resistance!'
    },
    emotionOnSuccess: 'hopeful'
  }
];
