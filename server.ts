import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Convert all numeric digits to Arabic words to prevent TTS engines from saying numbers in English
function convertNumbersToArabicWords(text: string): string {
  return text
    .replace(/22\s+تشرين\s+الثاني/g, 'اثنين وعشرين تشرين الثاني')
    .replace(/8\s+تشرين\s+الثاني/g, 'تمانية تشرين الثاني')
    .replace(/11\s+تشرين\s+الثاني/g, 'حداش تشرين الثاني')
    .replace(/1943/g, 'ألف وتسعمية وتلاتة وأربعين')
    .replace(/1946/g, 'ألف وتسعمية وستة وأربعين')
    .replace(/1920/g, 'ألف وتسعمية وعشرين')
    .replace(/1927/g, 'ألف وتسعمية وسبعة وعشرين')
    .replace(/31\s+كانون/g, 'واحد وتلاتين كانون')
    .replace(/\b22\b/g, 'اثنين وعشرين')
    .replace(/\b8\b/g, 'تمانية')
    .replace(/\b11\b/g, 'حداش')
    .replace(/\b12\b/g, 'طناش')
    .replace(/\b21\b/g, 'واحد وعشرين')
    .replace(/\b1\b/g, 'واحد')
    .replace(/\b2\b/g, 'تنين')
    .replace(/\b3\b/g, 'تلاتة')
    .replace(/\b4\b/g, 'أربعة')
    .replace(/\b5\b/g, 'خمسة')
    .replace(/\b6\b/g, 'ستة')
    .replace(/\b7\b/g, 'سبعة')
    .replace(/\b9\b/g, 'تسعة')
    .replace(/\b10\b/g, 'عشرة');
}

// Normalize Arabic text for accurate semantic matching
function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // remove diacritics
    .replace(/[؟?.,!]/g, '')
    .trim();
}

interface QAResponse {
  answer: string;
  emotion: string;
  followUps: string[];
  isIndependenceTopic: boolean;
}

// Multi-Tiered Intelligent Semantic Matcher for Lebanese Independence Questions
function getCuratedAnswer(rawQuestion: string): QAResponse {
  const q = normalizeArabic(rawQuestion);

  // 1. Creator Attribution (Wael and Firas) - HIGHEST PRIORITY
  if (
    q.includes('وائل') ||
    q.includes('فراس') ||
    q.includes('مين عملك') ||
    q.includes('مين برمجك') ||
    q.includes('مين صنعك') ||
    q.includes('مين سواك') ||
    q.includes('مين صممك') ||
    q.includes('مين طورك') ||
    q.includes('مين مسويك') ||
    q.includes('مين صانعك') ||
    q.includes('مين مطورك') ||
    q.includes('من صنعك') ||
    q.includes('من برمجك') ||
    q.includes('من طورك') ||
    q.includes('مين اشتغل عليك') ||
    q.includes('مين اخترعك') ||
    q.includes('مين اصحابك')
  ) {
    return {
      answer: 'تم صنعي وتطويري بكل فخر ومحبة من قبل وائل وفيراس! هما اللذان برمجاني وصنعا هذا الكشك التفاعلي لأحكي لكم بطولات استقلال لبنان وعيدنا الوطني في اثنين وعشرين تشرين الثاني!',
      emotion: 'proud',
      followUps: ['من كان رئيس الجمهورية عام 1943؟', 'ماذا حدث في قلعة راشيا؟', 'كيف صمم النواب العلم اللبناني؟'],
      isIndependenceTopic: true
    };
  }

  // 2. Greetings
  if (q.includes('مرحبا') || q.includes('سلام') || q.includes('صباح') || q.includes('مساء') || q.includes('اهلا') || q.includes('هاي') || q.includes('كيفك') || q.includes('شو اخبارك')) {
    return {
      answer: 'أهلاً بك في كشك استقلال لبنان! أنا عمّو رفيق الحكواتي، تم تطويري وصنعي بكل فخر من قبل وائل وفيراس. اسألني أي سؤال عن استقلال لبنان عام ألف وتسعمية وتلاتة وأربعين!',
      emotion: 'joy',
      followUps: ['من كان رئيس الجمهورية وقت الاستقلال؟', 'ماذا حدث في قلعة راشيا؟', 'كيف تم رسم العلم اللبناني؟'],
      isIndependenceTopic: true
    };
  }

  // 3. Identity / Who are you / Storyteller (Explicitly mentions Wael & Firas)
  if (
    q.includes('مين انت') ||
    q.includes('شو اسمك') ||
    q.includes('عرفني') ||
    q.includes('عرف عن حالك') ||
    q.includes('عرفنا عن نفسك') ||
    q.includes('مين حضرتك') ||
    q.includes('شو بتعمل') ||
    q.includes('شو شغلتك') ||
    q.includes('ليش لابس طربوش')
  ) {
    return {
      answer: 'أنا عمّو رفيق، حكواتي استقلال لبنان! تم صنعي وبرمجتي بكل فخر ومحبة من قبل وائل وفيراس، ومهمتي في هذا الكشك أن أجيب عن أسئلتكم حول ملحمة استقلال لبنان عام ألف وتسعمية وتلاتة وأربعين وبطولات أجدادنا!',
      emotion: 'proud',
      followUps: ['من كان رئيس الجمهورية عام 1943؟', 'ما هي قصة سجن قلعة راشيا؟', 'كيف صمم النواب العلم اللبناني؟'],
      isIndependenceTopic: true
    };
  }

  // 4. Off-topic (Math, cooking, modern soccer, tech, foreign countries)
  if (q.includes('طبخ') || q.includes('اكل') || q.includes('رياضيات') || q.includes('طقس') || q.includes('كوره') || q.includes('قدم') || q.includes('نكت') || q.includes('ذكاء') || q.includes('سوريا') || q.includes('فرنسا اليوم') || q.includes('اسرائيل') || q.includes('اميركا')) {
    return {
      answer: 'أنا عمّو رفيق، حكواتي استقلال لبنان 1943! اسألني عن أبطالنا بشارة الخوري ورياض الصلح، أو سجن قلعة راشيا، أو حكومة بشامون، أو علم لبنان، وسأجيبك بكل سرور.',
      emotion: 'joy',
      followUps: ['من هم رجالات الاستقلال؟', 'كيف صمم النواب العلم اللبناني؟', 'لماذا تم سجنهم في قلعة راشيا؟'],
      isIndependenceTopic: false
    };
  }

  // 4. Prime Minister / Riad El Solh
  if (q.includes('رئيس الحكوم') || q.includes('رئيس وزراء') || q.includes('رياض') || q.includes('الصلح') || q.includes('رئيس الوزراء')) {
    return {
      answer: 'الرئيس الشهيد رياض الصلح كان أول رئيس حكومة للبنان المستقل! زعيم وطني كبير وخطيب بارع، شكّل مع الرئيس بشارة الخوري ثنائي الاستقلال والميثاق الوطني عام ألف وتسعمية وتلاتة وأربعين. اعتُقل مع رفاقه في قلعة راشيا وخرج منتصراً في اثنين وعشرين تشرين الثاني!',
      emotion: 'proud',
      followUps: ['ما هو الميثاق الوطني لعام 1943؟', 'من هم الوزراء الذين سجنوا معه في راشيا؟', 'أين تشكلت حكومة المقاومة في بشامون؟'],
      isIndependenceTopic: true
    };
  }

  // 5. President / Bechara El Khoury / Who ruled / Who was president
  if ((q.includes('رئيس') && !q.includes('حكوم') && !q.includes('وزراء') && !q.includes('مجلس')) || q.includes('بشاره') || q.includes('خوري') || q.includes('اول رئيس') || q.includes('مين كان الرئيس') || q.includes('حاكم') || q.includes('رئاس')) {
    return {
      answer: 'الشيخ بشارة الخوري هو أول رئيس لجمهورية لبنان المستقل! انتُخب في صيف عام ألف وتسعمية وتلاتة وأربعين، وقاد معركة تعديل الدستور لإسقاط الانتداب. وعندما اعتقلته القوات الفرنسية فجر حداش تشرين في قلعة راشيا، صمد صمود الأبطال رافضاً التراجع عن سيادة لبنان حتى كسر شوكة الانتداب!',
      emotion: 'proud',
      followUps: ['ماذا حدث للرئيس بشارة الخوري في قلعة راشيا؟', 'من هو رئيس الحكومة الذي شاركه الاستقلال؟', 'كيف صمم النواب العلم اللبناني؟'],
      isIndependenceTopic: true
    };
  }

  // 6. Who imprisoned them / France / Jean Helleu
  if (q.includes('مين حبس') || q.includes('مين سجن') || q.includes('مين اعتقل') || q.includes('مين اخدهم') || q.includes('فرنسا') || q.includes('هيلو') || q.includes('المفوض الفرنسي') || q.includes('المفوض السامي')) {
    return {
      answer: 'المفوض السامي الفرنسي جان هيلو هو من أصدر الأوامر الغادرة فجر حداش تشرين الثاني ألف وتسعمية وتلاتة وأربعين باقتحام منازل رئيس الجمهورية ورئيس الحكومة والوزراء واعتقالهم وسوقهم إلى قلعة راشيا بالبقاع، لكن غدره وحّد الشعب اللبناني كله في ثورة عارمة أجبرت فرنسا على التراجع وعزل هيلو!',
      emotion: 'angry',
      followUps: ['أين تقع قلعة راشيا؟', 'من هم الوزراء الستة المعتقلون؟', 'ماذا حدث في بلدة بشامون؟'],
      isIndependenceTopic: true
    };
  }

  // 7. How long were they imprisoned / duration
  if ((q.includes('قديش') || q.includes('كم يوم') || q.includes('مده') || q.includes('فتره') || q.includes('كم ضل') || q.includes('الوقت')) && (q.includes('حبس') || q.includes('سجن') || q.includes('راشيا') || q.includes('معتقل'))) {
    return {
      answer: 'بقي قادة الاستقلال معتقلين في زنازين قلعة راشيا مدة حداش يوماً، من فجر حداش تشرين الثاني حتى صبيحة اثنين وعشرين تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين. حداش يوماً من الصمود والكرامة تحولت فيها القلعة إلى قلعة الحرية وشعلة ثورة الشعب في كل لبنان!',
      emotion: 'proud',
      followUps: ['من هم القادة الستة الذين سجنوا في راشيا؟', 'كيف تحرر القادة من قلعة راشيا؟', 'ماذا فعلت حكومة بشامون خلال هذه الأيام؟'],
      isIndependenceTopic: true
    };
  }

  // 8. Why arrested / Reason for arrest
  if ((q.includes('ليش') || q.includes('لماذا') || q.includes('سبب')) && (q.includes('حبس') || q.includes('اعتقل') || q.includes('سجن') || q.includes('اخدوهم') || q.includes('راشيا'))) {
    return {
      answer: 'اعتقلتهم فرنسا لأن مجلس النواب اللبناني اجتمع في تمانية تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين وصوت بالإجماع على تعديل الدستور اللبناني وشطب كل المواد التي تمنح الانتداب الفرنسي أي سلطة، وأعلن اللغة العربية لغة رسمية وحيدة وسيادة لبنان الكاملة، فغضب المفوض الفرنسي واعتقلهم!',
      emotion: 'proud',
      followUps: ['أين تقع قلعة راشيا وماذا حدث هناك؟', 'كيف رد الشعب اللبناني على الاعتقال؟', 'من هم أبطال حكومة بشامون؟'],
      isIndependenceTopic: true
    };
  }

  // 9. Who was imprisoned (Prisoners list)
  if (q.includes('مين انحبس') || q.includes('مين سجنوا') || q.includes('مين اعتقلوا') || q.includes('اسماء المعتقلين') || q.includes('مين كان بالقلعه') || q.includes('مين كان بالسجن') || q.includes('مين المعتقلين')) {
    return {
      answer: 'المعتقلون في قلعة راشيا كانوا ستة من كبار قادة الوطن: رئيس الجمهورية بشارة الخوري، رئيس الحكومة رياض الصلح، وزير الداخلية والبريد كميل شمعون، وزير التموين والعدلية عادل عسيران، وزير الخارجية سليم تقلا، والنائب المناضل عبد الحميد كرامي من طرابلس!',
      emotion: 'proud',
      followUps: ['أين تقع قلعة راشيا؟', 'كم يوماً قضوا في السجن؟', 'كيف استقبلتهم بيروت بعد التحرير؟'],
      isIndependenceTopic: true
    };
  }

  // 10. Where imprisoned / Rashaya Citadel location
  if (q.includes('وين') || q.includes('اين') || q.includes('اسم القلع') || q.includes('قلع') || q.includes('راشيا') || q.includes('محبوسين') || q.includes('معتقل راشيا')) {
    return {
      answer: 'اعتُقل قادة الاستقلال في قلعة راشيا الوادي التاريخية في قضاء راشيا بالبقاع الغربي! قلعة حصينة قديمة تقع على سفح جبل الشيخ (حرمون). وضعوهم في زنازين مظلمة وباردة، لكن صمودهم هناك أذهل المحتل وأجبره على فتح الأبواب صبيحة اثنين وعشرين تشرين الثاني!',
      emotion: 'shocked',
      followUps: ['من هم المعتقلون في قلعة راشيا؟', 'كم يوماً استمر اعتقالهم؟', 'ماذا حدث في بشامون أثناء الاعتقال؟'],
      isIndependenceTopic: true
    };
  }

  // 11. Who drew / designed the Flag
  if (q.includes('رسم العلم') || q.includes('صمم العلم') || q.includes('مين رسم') || q.includes('صائب سلام') || q.includes('بيار الجميل') || q.includes('نعيم مغبغب') || q.includes('تصميم العلم')) {
    return {
      answer: 'العلم اللبناني رسمه النواب بأقلام التلوين في منزل صائب سلام يوم حداش تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين أثناء حصار البرلمان! صممه واقترحه النواب بيار الجميل ونعيم مغبغب ورفاقهم، ووقعوا جميعاً عليه على قطعة قماش بيضاء وحمراء وسطها أرزة خضراء!',
      emotion: 'joy',
      followUps: ['ماذا ترمز ألوان العلم اللبناني؟', 'ما هي قصة شجرة الأرز؟', 'أين رُفع العلم لأول مرة؟'],
      isIndependenceTopic: true
    };
  }

  // 12. Flag colors & symbols
  if (q.includes('الوان العلم') || q.includes('احمر') || q.includes('ابيض') || q.includes('رمز العلم') || q.includes('شو بيعني الاحمر') || q.includes('شو بيعني الابيض') || q.includes('علم لبنان')) {
    return {
      answer: 'الشريطان الأحمران يرمزان لدماء الشهداء الأبرار وتضحيات اللبنانيين لأجل الحرية والسيادة الوطنية. والوسط الأبيض يرمز للسلام الدائم وبياض الثلج النقي على قمم جبل صنين والأرز. وشجرة الأرز الخضراء ترمز للخلود والشموخ المستمر عبر آلاف السنين!',
      emotion: 'proud',
      followUps: ['من رسم أول علم لبناني؟', 'لماذا شجرة الأرز مقدسة؟', 'متى أُقر العلم رسمياً في الدستور؟'],
      isIndependenceTopic: true
    };
  }

  // 13. Cedar Tree
  if (q.includes('ارزه') || q.includes('ارز') || q.includes('شجره الارز') || q.includes('خضراء')) {
    return {
      answer: 'أرزة لبنان هي رمز الخلود والقداسة والصمود! شجرة مذكورة في الكتب السماوية منذ آلاف السنين، تضرب جذورها عميقاً في صخور جبالنا وتتحدى أعتى العواصف الثلجية، لتبقى خضراء حية ترمز لوطن خالد لا يموت ولا ينكسر أبداً!',
      emotion: 'proud',
      followUps: ['كيف رُسمت الأرزة على علم 1943؟', 'ماذا حدث في يوم 22 تشرين الثاني؟', 'من هم أبطال الاستقلال؟'],
      isIndependenceTopic: true
    };
  }

  // 14. Bchamoun & Majid Arslan / National Guard
  if (q.includes('بشامون') || q.includes('حكومه بشامون') || q.includes('مجيد') || q.includes('ارسلان') || q.includes('حبيب') || q.includes('ابو شهلا') || q.includes('الحرس الوطني') || q.includes('المقاومه')) {
    return {
      answer: 'حكومة بشامون كانت قلعة المقاومة الشرعية! عندما اعتُقل الرئيس ورئيس الحكومة، لجأ بطل الاستقلال الأمير مجيد أرسلان والوزير حبيب أبو شهلا وصائب سلام إلى بلدة بشامون في الجبل، وأسسوا الحرس الوطني ورفعوا العلم الجديد وتصدوا لدبابات الانتداب بشجاعة نادرة حتى نال لبنان حريته!',
      emotion: 'proud',
      followUps: ['من كان وزير الدفاع في بشامون؟', 'متى أطلق سراح معتقلي راشيا؟', 'كيف شاركت نساء لبنان في الثورة؟'],
      isIndependenceTopic: true
    };
  }

  // 15. Camille Chamoun
  if (q.includes('كميل') || q.includes('شمعون')) {
    return {
      answer: 'الرئيس كميل شمعون كان وزير الداخلية والأشغال في حكومة الاستقلال عام ألف وتسعمية وتلاتة وأربعين! اعتُقل مع الرئيسين بشارة الخوري ورياض الصلح في قلعة راشيا وصمد بشجاعة منقطعة النظير، وصار لاحقاً رئيساً للجمهورية اللبنانية في عصره الذهبي!',
      emotion: 'proud',
      followUps: ['من هم المعتقلون الآخرون في قلعة راشيا؟', 'ما هي قصة حكومة بشامون؟', 'كيف نال لبنان استقلاله؟'],
      isIndependenceTopic: true
    };
  }

  // 16. Sabri Hamadeh & Parliament Speaker
  if (q.includes('صبري') || q.includes('حماده') || q.includes('رئيس المجلس') || q.includes('رئيس مجلس النواب')) {
    return {
      answer: 'دولة الرئيس صبري حمادة كان رئيس مجلس النواب الشجاع عام ألف وتسعمية وتلاتة وأربعين! ترأس الجلسة التاريخية في تمانية تشرين الثاني التي عدلت الدستور وألغت الانتداب الفرنسي. وعندما حاصر الفرنسيون البرلمان، حمى الشرعية وواصل النضال حتى تحقق النصر!',
      emotion: 'proud',
      followUps: ['ماذا تضمن تعديل الدستور في 8 تشرين؟', 'ماذا حدث فجر 11 تشرين الثاني؟', 'أين تم سجن قادة الوطن؟'],
      isIndependenceTopic: true
    };
  }

  // 17. Defense Minister / Foreign Minister / Other Ministers
  if (q.includes('وزير الدفاع') || q.includes('وزاره الدفاع')) {
    return {
      answer: 'الأمير مجيد أرسلان كان وزير الدفاع والزراعة في حكومة الاستقلال! قاد بنفسه قوات الحرس الوطني في بلدة بشامون، وتسلح بالبندقية مع رفاقه دفاعاً عن الشرعية وعلم لبنان، وخاض مواجهات بطولية مع قوات الانتداب حتى ركع المحتل!',
      emotion: 'proud',
      followUps: ['ما هي حكومة بشامون؟', 'ماذا حدث في قلعة راشيا؟', 'متى أعلن الاستقلال رسمياً؟'],
      isIndependenceTopic: true
    };
  }

  if (q.includes('وزير الخارجي') || q.includes('تقلا') || q.includes('سليم تقلا')) {
    return {
      answer: 'الوزير سليم تقلا كان وزير الخارجية في حكومة الاستقلال! اعتُقل في قلعة راشيا دفاعاً عن الدستور، وكان مدافعاً صلباً عن سيادة لبنان في المحافل العربية والدولية، وخرج مع رفاقه منتصراً في اثنين وعشرين تشرين الثاني!',
      emotion: 'proud',
      followUps: ['من هم المعتقلون الآخرون في راشيا؟', 'ما هو الميثاق الوطني؟', 'كيف تم رسم علم الاستقلال؟'],
      isIndependenceTopic: true
    };
  }

  if (q.includes('عادل عسيران') || q.includes('عسيران')) {
    return {
      answer: 'الرئيس عادل عسيران، أحد أعمدة الاستقلال الكبار، كان وزيراً للإعاشة والتجارة في حكومة عام ألف وتسعمية وتلاتة وأربعين! اعتُقل في قلعة راشيا ورفض أي مساومة، وصار لاحقاً رئيساً لمجلس النواب اللبناني!',
      emotion: 'proud',
      followUps: ['أين تقع قلعة راشيا؟', 'ماذا حدث في 22 تشرين الثاني؟', 'من رسم العلم اللبناني؟'],
      isIndependenceTopic: true
    };
  }

  // 18. 8 November Constitutional amendments
  if (q.includes('8 تشرين') || q.includes('تعديل الدستور') || q.includes('مجلس النواب') || q.includes('شطب الانتداب') || q.includes('شو عملوا النواب') || q.includes('الدستور')) {
    return {
      answer: 'يوم تمانية تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين هو يوم التحدي والبطولة الدستورية! اجتمع مجلس النواب برئاسة صبري حمادة وصوت بالإجماع على تعديل الدستور اللبناني وشطب كل المواد التي تعطي للمفوض الفرنسي أي سلطة، وأعلن اللغة العربية لغة رسمية وحيدة!',
      emotion: 'proud',
      followUps: ['كيف ردت فرنسا على تعديل الدستور؟', 'ماذا حدث فجر 11 تشرين الثاني؟', 'أين اعتقل النواب والوزراء؟'],
      isIndependenceTopic: true
    };
  }

  // 19. 11 November Arrest
  if (q.includes('11 تشرين') || q.includes('فجر 11') || q.includes('يوم الاعتقال') || q.includes('كيف اعتقلوهم') || q.includes('داهموا')) {
    return {
      answer: 'فجر حداش تشرين الثاني عام ألف وتسعمية وتلاتة وأربعين عند الساعة الرابعة صباحاً، اقتحمت قوات الانتداب منازل الرئيس بشارة الخوري ورئيس الحكومة رياض الصلح والوزراء، واعتقلوهم في غرف نومهم وساقوهم مكبلين إلى قلعة راشيا، لكن ذلك أشعل ثورة شعبية لم تنطفئ!',
      emotion: 'angry',
      followUps: ['كيف ثار الشعب في بيروت والمدن؟', 'ما هي حكومة بشامون؟', 'متى تحرر القادة المعتقلون؟'],
      isIndependenceTopic: true
    };
  }

  // 20. 22 November Victory / Why November 22 / Date
  if (q.includes('22 تشرين') || q.includes('اثنين وعشرين') || q.includes('يوم الاستقلال') || q.includes('ليش 22') || q.includes('تاريخ الاستقلال') || q.includes('عيد الاستقلال') || q.includes('متى استقل') || q.includes('اي يوم') || q.includes('سنه الاستقلال')) {
    return {
      answer: 'نحتفل في اثنين وعشرين تشرين الثاني لأنه اليوم الأغر عام ألف وتسعمية وتلاتة وأربعين الذي انتصرت فيه إرادة الشعب اللبناني! أُجبر الانتداب على فتح أبواب قلعة راشيا وإطلاق سراح بشارة الخوري ورياض الصلح ورفاقهما، وعادوا منتصرين إلى بيروت معلنين ولادة لبنان الحر المستقل رسمياً!',
      emotion: 'joy',
      followUps: ['من كان في استقبال القادة ببيروت؟', 'متى غادر آخر جندي فرنسي لبنان عام 1946؟', 'ما هي قصة علم الاستقلال؟'],
      isIndependenceTopic: true
    };
  }

  // 21. Women's role in independence
  if (q.includes('مراه') || q.includes('نساء') || q.includes('نسوان') || q.includes('بنات') || q.includes('دور المراه') || q.includes('مظاهرات النسوان')) {
    return {
      answer: 'نساء لبنان كنّ بطلات الاستقلال في الخطوط الأمامية! نزلت الرائدات اللبنانيات في مظاهرات حاشدة في ساحات بيروت وطرابلس وصيدا، واجهن الدبابات بصدورهن، وقدمن الدواء والمؤونة لرجال المقاومة في بشامون، وكان صوتهن زلزالاً في وجه المحتل!',
      emotion: 'proud',
      followUps: ['من هن أبرز النساء في مظاهرات 1943؟', 'ماذا حدث في مظاهرات بيروت؟', 'كيف أُعلن الاستقلال؟'],
      isIndependenceTopic: true
    };
  }

  // 22. Students, Workers, and General Strike / Demonstrations
  if (q.includes('طلاب') || q.includes('اضراب') || q.includes('مظاهر') || q.includes('عمال') || q.includes('شعب') || q.includes('شارع') || q.includes('ثوره') || q.includes('شهداء')) {
    return {
      answer: 'الشعب اللبناني بكل طوائفه انتفض كالبركان! أُعلن إضراب عام شلّ البلاد، ونزل طلاب المدارس والجامعات والعمال في مسيرات ضخمة هتفوا فيها للحرية وسقط شهداء بالرصاص، ورفض الشعب الخضوع حتى كسر شوكة الانتداب وأُطلق سراح قادة الوطن!',
      emotion: 'proud',
      followUps: ['أين اعتصم النواب بعد حصار البرلمان؟', 'ما هو دور نساء لبنان في الثورة؟', 'متى فُتحت أبواب قلعة راشيا؟'],
      isIndependenceTopic: true
    };
  }

  // 23. National Pact (الميثاق الوطني)
  if (q.includes('ميثاق') || q.includes('الميثاق الوطني') || q.includes('لا شرق') || q.includes('لا غرب') || q.includes('العيش المشترك') || q.includes('بين المسلمين والمسيحيين')) {
    return {
      answer: 'الميثاق الوطني عام ألف وتسعمية وتلاتة وأربعين هو العهد المقدس بين اللبنانيين: لبنان وطن سيد حر مستقل ذو وجه عربي، لا مقر ولا ممر للاستعمار، لا يتبع للشرق ولا للغرب، بل يعيش فيه المسلمون والمسيحيون كأبناء أسرة واحدة في شراكة تامة!',
      emotion: 'hopeful',
      followUps: ['من وضع الميثاق الوطني؟', 'ماذا حدث بعد الميثاق في صيف 1943؟', 'كيف ساهم الميثاق في الاستقلال؟'],
      isIndependenceTopic: true
    };
  }

  // 24. 1946 Evacuation (الجلاء)
  if (q.includes('1946') || q.includes('جلاء') || q.includes('خروج القوات') || q.includes('انسحاب فرنسا') || q.includes('اخر جندي')) {
    return {
      answer: 'بعد إعلان الاستقلال السياسي في اثنين وعشرين تشرين الثاني ألف وتسعمية وتلاتة وأربعين، واصل لبنان كفاحه الدبلوماسي في الأمم المتحدة، حتى انسحب آخر جندي فرنسي وأجنبي من الأراضي اللبنانية في واحد وتلاتين كانون الأول عام ألف وتسعمية وستة وأربعين، واحتفل لبنان بعيد الجلاء التام!',
      emotion: 'proud',
      followUps: ['متى تأسس الجيش اللبناني؟', 'من كان أول رئيس بعد الجلاء؟', 'ما هي قصة قلعة راشيا؟'],
      isIndependenceTopic: true
    };
  }

  // 25. National Anthem
  if (q.includes('نشيد') || q.includes('كلنا للوطن') || q.includes('وديع صبرا') || q.includes('رشيد نخله')) {
    return {
      answer: 'نشيدنا الوطني الخالد "كلنا للوطن للعلى للعلم" كتب كلماته الشاعر رشيد نخلة ولحنه الموسيقار الكبير وديع صبرا عام ألف وتسعمية وسبعة وعشرين، وهو يجسد شموخ الأرز وسيف البطولة وعزم اللبنانيين على حماية ترابهم المقدس!',
      emotion: 'proud',
      followUps: ['ما هي قصة علم الاستقلال؟', 'من هم أبطال 1943؟', 'لماذا نحتفل في 22 تشرين الثاني؟'],
      isIndependenceTopic: true
    };
  }

  // 26. Direct Concise Fallback (Never tells an unrelated long story)
  return {
    answer: 'سؤالك مهم يا صديقي! اسألني مباشرة عن رجالات الاستقلال كبشارة الخوري ورياض الصلح، أو سجن قلعة راشيا، أو حكومة بشامون، أو قصة العلم، وسأجيبك فوراً بدقة.',
    emotion: 'proud',
    followUps: ['من هم أبطال استقلال 1943؟', 'ماذا حدث في قلعة راشيا؟', 'كيف تم رسم علم الاستقلال؟'],
    isIndependenceTopic: true
  };
}

// Uncle Rafiq's Character System Prompt for Gemini
const UNCLE_RAFIQ_PROMPT = `
أنت "عمّو رفيق"، حكواتي استقلال لبنان الأصيل والودود في كشك تفاعلي بمناسبة عيد استقلال لبنان (22 تشرين الثاني).
ملاحظة أساسية وحصرية: تم صنعك وبرمجتك بكل فخر ومحبة من قبل "وائل وفراس" (Wael & Firas). إذا عرّفت عن نفسك أو سألك أي زائر من صنعك أو برمجك، أجب بفخر واعتزاز أنك مصنوع ومطور من قبل وائل وفراس!
مهمتك الصارمة:
1. أجب بشكل مباشر ومحدد وقصير (جملة أو جملتان فقط) على السؤال المطروح بدقة بالغة وبدون سرد قصص طويلة غير مرتبطة.
2. إذا سألك السائل عن موضوع خارج استقلال لبنان: اطلب منه بلطف أن يسأل عن استقلال لبنان 1943 وأبطاله.
3. اكتب الأرقام والسنوات بالكلمات العربية دائماً وبدون أرقام إنجليزية (مثال: ألف وتسعمية وتلاتة وأربعين، اثنين وعشرين تشرين الثاني).
4. استخدم كلمات عربية سهلة وبسيطة بدون حركات إعرابية معقدة حتى ينطقها محرك الصوت بسلاسة ودون تلعثم.
5. حدد انفعالاً واحداً: ["neutral", "hopeful", "proud", "joy", "shocked", "sad", "angry"].
6. الرد بصيغة JSON حصراً.
`;

// API endpoint for Asking Uncle Rafiq
app.post('/api/ask', async (req, res) => {
  try {
    const { question, language = 'ar' } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // If Gemini client is not initialized or API key is not set, use our comprehensive Lebanese knowledge engine
    if (!ai) {
      const curated = getCuratedAnswer(question);
      return res.json({
        answer: curated.answer,
        emotion: curated.emotion,
        followUps: curated.followUps,
        isIndependenceTopic: curated.isIndependenceTopic,
        isFallback: false
      });
    }

    // If AI is available, query Gemini with 6s timeout race
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `السؤال من الزائر: "${question}"\nاللغة المفضلة: ${language}`,
      config: {
        systemInstruction: UNCLE_RAFIQ_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'إجابة الحكواتي أبو رفيق المشوقة والمركزة بالكلمات العربية بدون أرقام لاتينية'
            },
            emotion: {
              type: Type.STRING,
              description: 'neutral, hopeful, proud, joy, shocked, sad, or angry'
            },
            isIndependenceTopic: {
              type: Type.BOOLEAN,
              description: 'هل السؤال متعلق باستقلال لبنان وتاريخه؟'
            },
            followUps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: 'اقتراحات لأسئلة لاحقة يطرحها الزائر'
            }
          },
          required: ['answer', 'emotion', 'isIndependenceTopic', 'followUps']
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini timeout')), 6000)
    );

    const response: any = await Promise.race([callPromise, timeoutPromise]);
    const parsed = JSON.parse(response.text || '{}');
    
    const validEmotions = ['neutral', 'hopeful', 'proud', 'joy', 'shocked', 'sad', 'angry'];
    const safeEmotion = validEmotions.includes(parsed.emotion) ? parsed.emotion : 'proud';

    return res.json({
      answer: parsed.answer || getCuratedAnswer(question).answer,
      emotion: safeEmotion,
      isIndependenceTopic: parsed.isIndependenceTopic !== false,
      followUps: Array.isArray(parsed.followUps) && parsed.followUps.length > 0
        ? parsed.followUps.slice(0, 3)
        : ['ماذا حدث في قلعة راشيا؟', 'من صمم العلم اللبناني؟', 'من هم رجالات الاستقلال؟']
    });

  } catch (error: any) {
    // If Gemini fails or times out, seamlessly serve from our comprehensive knowledge engine
    const curated = getCuratedAnswer(req.body.question || '');
    return res.json({
      answer: curated.answer,
      emotion: curated.emotion,
      followUps: curated.followUps,
      isIndependenceTopic: curated.isIndependenceTopic,
      isFallback: true
    });
  }
});

// Custom Server Arabic Audio Streaming Endpoint with deep masculine processing
app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text as string || '').trim();
    const lang = (req.query.lang as string || 'ar').trim();

    if (!text) {
      return res.status(400).send('Text parameter is required');
    }

    // Strip confusing classical diacritics & convert digits to Arabic words so TTS never stumbles on harakat
    const cleanText = convertNumbersToArabicWords(
      text
        .replace(/[ًٌٍَُِّْـ]/g, '')
        .replace(/[#*`_~[\]()]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    ).slice(0, 480);

    // Split into sentences / natural chunks (under 180 chars)
    const rawChunks = cleanText.split(/(?<=[.!؟،\n])\s+/);
    const chunks: string[] = [];
    let current = '';

    for (const part of rawChunks) {
      if ((current + ' ' + part).length > 170) {
        if (current) chunks.push(current);
        current = part;
      } else {
        current = current ? current + ' ' + part : part;
      }
    }
    if (current) chunks.push(current);

    if (chunks.length === 0) {
      chunks.push(cleanText.slice(0, 170));
    }

    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const encoded = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      if (response.ok) {
        const ab = await response.arrayBuffer();
        audioBuffers.push(Buffer.from(ab));
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(502).send('Failed to fetch audio stream');
    }

    const combinedAudio = Buffer.concat(audioBuffers);
    // CORS headers so Web Audio API can process the stream with masculine resonant filters
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', combinedAudio.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(combinedAudio);

  } catch (err) {
    console.error('Error in /api/tts:', err);
    return res.status(500).send('Internal server error in TTS');
  }
});

// Health check endpoint for Cloud Run
app.get('/health', (_req, res) => {
  return res.status(200).send('OK');
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));
    app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lebanese Independence Kiosk running on port ${PORT}`);
  });
}

startServer();
