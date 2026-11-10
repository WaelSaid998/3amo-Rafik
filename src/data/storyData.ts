import { StoryScene } from '../types';

export const STORY_SCENES: StoryScene[] = [
  {
    id: 'mandate',
    order: 1,
    iconName: 'mandate',
    yearDate: '1920 - 1943',
    emotion: 'sad',
    bgGradient: 'radial-gradient(ellipse at top, #292524 0%, #1c1917 60%, #0c0a09 100%)',
    accentColor: '#94a3b8',
    title: {
      ar: 'عهد الانتداب وقيد الانتظار',
      fr: 'Le Mandat Français et la longue attente',
      en: 'The French Mandate and the Long Wait',
    },
    subtitle: {
      ar: 'أكثر من عقدين من الشوق لسيادة وطنية حقيقية',
      fr: 'Plus de deux décennies d\'aspiration à une vraie souveraineté',
      en: 'Over two decades of yearning for true national sovereignty',
    },
    narrative: {
      ar: 'يا أبنائي، بعد انتهاء الحرب العالمية الأولى، وُضِع لبنان تحت الانتداب الفرنسي منذ عام 1920. كان شعبنا المكافح، من أقصى الشمال إلى أقصى الجنوب، يحلم بوطن حرّ لا وصاية عليه، فظلّت روح العزة مشتعلة في قلوب الآباء والأجداد!',
      fr: 'Mes enfants, après la Première Guerre mondiale, le Liban fut placé sous mandat français en 1920. Notre peuple vaillant n\'a jamais cessé de rêver d\'une patrie libre et sans tutelle!',
      en: 'My children, after World War I, Lebanon was placed under the French Mandate in 1920. Our resilient people never stopped dreaming of a free sovereign homeland without foreign tutelage!',
    },
    location: {
      ar: 'بيروت وجميع المناطق اللبنانية',
      fr: 'Beyrouth et toutes les régions libanaises',
      en: 'Beirut and all Lebanese regions',
    },
    keyFigures: ['شعب لبنان المكافح', 'رواد النهضة الفكرية']
  },
  {
    id: 'elections',
    order: 2,
    iconName: 'elections',
    yearDate: 'صيف 1943',
    emotion: 'hopeful',
    bgGradient: 'radial-gradient(ellipse at top, #362f1d 0%, #1e1b18 60%, #0c0a09 100%)',
    accentColor: '#fbbf24',
    title: {
      ar: 'انتخابات الأمل والميثاق الوطني',
      fr: 'Les Élections de l\'Espoir et le Pacte National',
      en: 'The Elections of Hope and National Pact',
    },
    subtitle: {
      ar: 'انتخاب الشيخ بشارة الخوري وتكليف رياض الصلح',
      fr: 'Élection de Béchara El Khoury et Riyad El Solh',
      en: 'Election of Bechara El Khoury and Riad El Solh',
    },
    narrative: {
      ar: 'في صيف عام 1943، هبّ نسيم الأمل العظيم! جرت انتخابات نيابية نزيهة انتخب فيها الشعب مجلساً وطنياً مخلصاً، فاختار النواب الشيخ بشارة الخوري رئيساً للجمهورية، وتولى الزعيم رياض الصلح رئاسة الحكومة، ليعقدا معاً "الميثاق الوطني" التاريخي لأجل لبنان واحد لا شرقياً ولا غربياً!',
      fr: 'À l\'été 1943, un vent d\'espoir souffla sur le Liban! Cheikh Béchara El Khoury fut élu Président de la République et Riyad El Solh devint Premier Ministre, scellant le Pacte National pour un Liban uni!',
      en: 'In the summer of 1943, a great breeze of hope arrived! Sheikh Bechara El Khoury was elected President of the Republic and Riad El Solh became Prime Minister, forging the historic National Pact for a united Lebanon!',
    },
    location: {
      ar: 'مجلس النواب - ساحة النجمة',
      fr: 'Parlement - Place de l\'Étoile',
      en: 'Parliament - Nejmeh Square',
    },
    keyFigures: ['بشارة الخوري', 'رياض الصلح', 'صبري حمادة']
  },
  {
    id: 'parliament',
    order: 3,
    iconName: 'parliament',
    yearDate: '8 تشرين الثاني 1943',
    emotion: 'proud',
    bgGradient: 'radial-gradient(ellipse at top, #143525 0%, #102219 60%, #06110b 100%)',
    accentColor: '#10b981',
    title: {
      ar: 'جلسة التحدي وتعديل الدستور',
      fr: 'La Session Historique et l\'Amendement Constitutionnel',
      en: 'The Defiant Session and Constitutional Amendment',
    },
    subtitle: {
      ar: 'شطب كل مواد الانتداب وإعلان السيادة الكاملة',
      fr: 'Suppression de tous les articles du mandat colonial',
      en: 'Removing all colonial mandate articles and asserting full sovereignty',
    },
    narrative: {
      ar: 'وقف نواب الأمة بشجاعة لا تلين في 8 تشرين الثاني! وافق البرلمان بالإجماع على تعديل الدستور اللبناني، وشطب جميع المواد التي تعطي للمفوض الفرنسي أي سلطة، وأعلنت اللغة العربية لغة رسمية وحيدة، ليكون لبنان سيداً حراً ومستقلاً بقراره!',
      fr: 'Le 8 novembre, nos députés ont agi avec un courage exemplaire! Ils ont voté à l\'unanimité la révision de la Constitution, abolissant tous les privilèges du mandat et consacrant la langue arabe comme seule langue officielle!',
      en: 'On November 8, the parliament stood with uncompromising courage! They unanimously amended the Lebanese constitution, striking down every mandate privilege and declaring Arabic as the sole official language of sovereign Lebanon!',
    },
    location: {
      ar: 'مجلس النواب اللبناني',
      fr: 'Parlement Libanais',
      en: 'Lebanese Parliament',
    },
    keyFigures: ['النواب اللبنانيون', 'صبري حمادة', 'سليم تقلا']
  },
  {
    id: 'arrest',
    order: 4,
    iconName: 'arrest',
    yearDate: 'فجر 11 تشرين الثاني 1943',
    emotion: 'shocked',
    bgGradient: 'radial-gradient(ellipse at top, #451a1a 0%, #2b1111 60%, #120505 100%)',
    accentColor: '#ef4444',
    title: {
      ar: 'الغدر فجراً واعتقال قلعة راشيا',
      fr: 'L\'Arrestation Nocturne et la Citadelle de Rachaya',
      en: 'The Dawn Raid and Arrest at Rashaya Citadel',
    },
    subtitle: {
      ar: 'المفوض جان هيلو يقتحم البيوت ويسجن قادة الوطن',
      fr: 'Le délégué français Helleu fait emprisonner les dirigeants',
      en: 'French delegate Helleu raids homes and imprisons national leaders',
    },
    narrative: {
      ar: 'يا للغدر والظلم! عند الساعة الرابعة فجراً، اقتحمت القوات السنغالية والفرنسية بيوت قادة الاستقلال، فاعتقلوا فخامة الرئيس بشارة الخوري، ودولة الرئيس رياض الصلح، والوزراء كميل شمعون، وعادل عسيران، وسليم تقلا، والمناضل عبد الحميد كرامي، واقتادوهم مكبّلين إلى قلعة راشيا الوادي الشاهقة في البقاع!',
      fr: 'Quelle injustice! À l\'aube du 11 novembre, les troupes coloniales envahissent les domiciles des dirigeants. Le Président Béchara El Khoury, Riyad El Solh, Camille Chamoun, Adel Osseiran et Salim Takla sont emmenés prisonniers à la forteresse de Rachaya!',
      en: 'What outrage! At 4:00 AM on November 11, colonial forces invaded leaders\' homes, arresting President Bechara El Khoury, Riad El Solh, Camille Chamoun, Adel Osseiran, Salim Takla, and Abdul Hamid Karami, locking them in the formidable Rashaya Citadel!',
    },
    location: {
      ar: 'قلعة راشيا الوادي - البقاع الغربي',
      fr: 'Citadelle de Rachaya - Békaa',
      en: 'Rashaya Citadel - West Bekaa',
    },
    keyFigures: ['بشارة الخوري', 'رياض الصلح', 'كميل شمعون', 'عادل عسيران', 'سليم تقلا']
  },
  {
    id: 'protest',
    order: 5,
    iconName: 'protest',
    yearDate: '12 - 21 تشرين الثاني 1943',
    emotion: 'angry',
    bgGradient: 'radial-gradient(ellipse at top, #5c2010 0%, #35130a 60%, #150603 100%)',
    accentColor: '#f97316',
    title: {
      ar: 'هبّة الشعب وحكومة بشامون الشرعية',
      fr: 'La Révolte Populaire et le Gouvernement de Bchamoun',
      en: 'The People\'s Uprising and the Bchamoun Government',
    },
    subtitle: {
      ar: 'النساء والطلاب والعمال في الشوارع، والحرس الوطني في الجبل',
      fr: 'Femmes, étudiants et travailleurs s\'unissent dans la rue',
      en: 'Women, students, and workers fill the streets; national guard stands firm',
    },
    narrative: {
      ar: 'ثار لبنان كله كالبركان! أغلقت الأسواق، ونزلت النساء الرائدات والطلاب في مظاهرات حاشدة في بيروت وطرابلس وصيدا وزحلة، واجهوا الرصاص بصدورهم العارية! وفي قرية بشامون الجبلية، تشكلت حكومة المقاومة الشرعية برئاسة الأمير مجيد أرسلان وحبيب أبو شهلا وصائب سلام، مشكلين الحرس الوطني للدفاع عن كرامة لبنان!',
      fr: 'Tout le Liban se leva comme un seul homme! Grève générale, manifestations massives menées par les femmes et les étudiants. À Bchamoun, un gouvernement provisoire de résistance s\'établit sous la direction de l\'Émir Majid Arslan et Habib Abou Chahla!',
      en: 'All of Lebanon erupted! A general strike paralyzed cities, while heroic women and students led fearless protests. In the mountain village of Bchamoun, a resistance government was formed by Emir Majid Arslan, Habib Abou Chahla, and Saeb Salam!',
    },
    location: {
      ar: 'شوارع بيروت وحكومة بشامون المؤقتة',
      fr: 'Rues de Beyrouth et QG de Bchamoun',
      en: 'Streets of Beirut and Bchamoun Headquarters',
    },
    keyFigures: ['الأمير مجيد أرسلان', 'حبيب أبو شهلا', 'صائب سلام', 'نسوة لبنان البطلات']
  },
  {
    id: 'freedom',
    order: 6,
    iconName: 'freedom',
    yearDate: '22 تشرين الثاني 1943',
    emotion: 'joy',
    bgGradient: 'radial-gradient(ellipse at top, #114232 0%, #0d281e 60%, #04120c 100%)',
    accentColor: '#22c55e',
    title: {
      ar: 'يوم النصر المجيد وكسر القيود',
      fr: 'Le Jour de la Victoire et la Libération',
      en: 'Glorious Victory Day: Breaking the Chains',
    },
    subtitle: {
      ar: 'إطلاق سراح أبطال راشيا وإعلان استقلال لبنان التام',
      fr: 'Libération des héros de Rachaya et proclamation de l\'Indépendance',
      en: 'Release of Rashaya heroes and proclamation of complete Independence',
    },
    narrative: {
      ar: 'يا للفرحة العارمة التي لا توصف! ركعت قوى الانتداب أمام صمود شعبنا وإصراره العظيم، وفي صباح 22 تشرين الثاني 1943، فُتحت أبواب قلعة راشيا وخرج أبطالنا أحراراً منتصرين! استقبلتهم الملايين بالزغاريد ونثر الورود والأرز في كل بلدة من البقاع إلى بيروت، وأعلن هذا اليوم عيداً وطنياً لاستقلال لبنان إلى الأبد!',
      fr: 'Quelle joie incommensurable! Face à la fermeté inébranlable du peuple, le mandat a cédé. Le matin du 22 novembre 1943, les portes de Rachaya s\'ouvrent et nos héros rentrent triomphants à Beyrouth sous les ovations populaires!',
      en: 'What boundless joy! Conceding to the relentless resolve of the people, the mandate yielded. On the morning of November 22, 1943, the fortress doors swung open and our leaders returned triumphant to Beirut amidst cheers of millions!',
    },
    location: {
      ar: 'قصر بعبدا وبيروت المحررة',
      fr: 'Palais présidentiel et Beyrouth libérée',
      en: 'Presidential Palace and Liberated Beirut',
    },
    keyFigures: ['بشارة الخوري', 'رياض الصلح', 'شعب لبنان المنتصر']
  },
  {
    id: 'flag',
    order: 7,
    iconName: 'flag',
    yearDate: 'رمز الخلود والسيادة',
    emotion: 'proud',
    bgGradient: 'radial-gradient(ellipse at top, #7f1d1d 0%, #2e0808 60%, #0c0202 100%)',
    accentColor: '#ef4444',
    title: {
      ar: 'ولادة علم الاستقلال الخالد',
      fr: 'La Naissance du Drapeau de l\'Indépendance',
      en: 'The Birth of the Immortal Flag of Independence',
    },
    subtitle: {
      ar: 'رُسم باليد ووقّعه النواب بالدم والفخر',
      fr: 'Dessiné à la main et signé fièrement par les députés',
      en: 'Hand-drawn and proudly signed by the deputies',
    },
    narrative: {
      ar: 'انظروا إلى هذا العلم الأبي! أثناء حصار البرلمان، اجتمع النواب الأحرار في منزل صائب سلام ورسموا بأقلام التلوين أول علم لبناني مستقل: شريطان أحمران يرمزان لدماء الشهداء الزكية، وبياض في الوسط كثلج صنين يرمز للسلام والنقاء، وتتوسطه أرزة خضراء ضاربة في عمق التاريخ ترمز للخلود والشموخ!',
      fr: 'Regardez notre cher drapeau! Pendant le siège, les députés dessinèrent le premier drapeau libanais indépendant: deux bandes rouges pour le sang des martyrs, un blanc immaculé pour la paix et la neige, et au centre, le cèdre vert éternel!',
      en: 'Behold our sacred flag! During the siege, patriots gathered at Saeb Salam\'s home and drew the first independent Lebanese flag: two red stripes for the martyrs\' blood, pure white for peace and mountain snow, and the evergreen cedar of immortality!',
    },
    location: {
      ar: 'بيروت - مرفوعاً فوق كل سارية ومبنى رسمي',
      fr: 'Beyrouth et tout le Liban',
      en: 'Beirut and across every rooftop in Lebanon',
    },
    keyFigures: ['بيار الجميل', 'نعيم مغبغب', 'صائب سلام', 'نواب الاستقلال']
  }
];
