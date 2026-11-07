import { 
  Course, 
  UserProfile, 
  ChatMessage, 
  PaymentTransaction, 
  DeviceChangeRequest, 
  ModerationReport, 
  AuditLogEntry, 
  DiscussionCategory, 
  DiscussionPost,
  MentorVideoCategory,
  MentorVideo,
  MentorProfile,
  Coupon,
  CouponRedemption,
  CouponAnalytics
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_arun_7781',
  name: 'Arun Kumar',
  email: 'nandhakumar052007@gmail.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'student',
  isGoogleVerified: true,
  registeredDevice: {
    id: 'DEV-A54-8902',
    deviceName: 'Samsung Galaxy A54 5G',
    model: 'SM-A546E/DS',
    os: 'Android 14 (OneUI 6.0)',
    browser: 'Chrome Mobile 123.0',
    ipAddress: '103.21.124.89',
    location: 'Chennai, Tamil Nadu, India',
    lastActive: 'Active now',
    isCurrent: true,
    status: 'active'
  },
  paymentDetails: {
    gpayUpiId: 'nandhakumar052007@okaxis',
    binanceUid: '1129930138',
    lastUpdated: '04 Nov 2026, 14:22'
  },
  enrolledCourseIds: ['course_smc_foundations'],
  completedLessonIds: ['lesson_f1'],
  activeCourseId: 'course_smc_foundations',
  activeLessonId: 'lesson_f2',
  currentPlaybackSeconds: 252 // 04:12 in seconds
};

export const COURSES: Course[] = [
  {
    id: 'course_smc_foundations',
    title: 'SMC Foundations & Market Structure',
    tagline: 'Master true institutional order flow, Break of Structure (BOS) vs Change of Character (CHoCH), and Liquidity mapping.',
    badge: 'Core SMC',
    tier: 'paid',
    price: 4999,
    originalPrice: 8999,
    rating: 4.9,
    studentCount: 1420,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    description: 'This is the foundational cornerstone of Smart Money Concepts. Learn how central banks, algorithmic market makers, and institutional desks engineer liquidity and execute orders in FX, Crypto, and Equities.',
    level: 'Beginner',
    learningOutcomes: [
      'Identify internal vs swing market structure with zero ambiguity',
      'Spot Break of Structure (BOS) vs Change of Character (CHoCH)',
      'Recognize Buy-side (BSL) and Sell-side (SSL) liquidity pools',
      'Map Fair Value Gaps (FVG) and premium vs discount equilibrium'
    ],
    lessons: [
      {
        id: 'lesson_f1',
        courseId: 'course_smc_foundations',
        title: '1. Welcome & Institutional Trading Mindset',
        titleTamil: '1. அறிமுகம் & நிறுவன வர்த்தக மனநிலை',
        durationMinutes: 3,
        durationSeconds: 10,
        videoDurationFormatted: '03:10',
        isFreePreview: true,
        order: 1,
        description: 'Orientation to the VYROX educational pathway and removing retail chart patterns (Double Tops, Trendlines) from your routine.',
        keyTakeaways: [
          'Retail patterns are liquidity traps for institutional algorithmic desks',
          'Trading is probability and asymmetric risk:reward management',
          'Platform guidelines and device authorization'
        ],
        subtitles: [
          {
            id: 'en',
            label: 'English',
            lang: 'en',
            cues: [
              { start: 0, end: 15, text: 'Welcome to the VYROX Institutional SMC Foundations program.' },
              { start: 16, end: 35, text: 'Our objective is simple: stop trading like retail liquidity, and learn how institutional algorithms operate.' },
              { start: 36, end: 60, text: 'Keep your trading journal ready as we begin with structural mapping.' }
            ]
          },
          {
            id: 'ta',
            label: 'தமிழ் (Tamil)',
            lang: 'ta',
            cues: [
              { start: 0, end: 15, text: 'VYROX இன்ஸ்டிட்யூஷனல் SMC பாடத்திட்டத்திற்கு அன்புடன் வரவேற்கிறோம்.' },
              { start: 16, end: 35, text: 'ரீடெயில் பேட்டர்ன்களை கைவிட்டு, நிறுவன அல்காரிதம்கள் எவ்வாறு இயங்குகின்றன என்பதை கற்பதே நம் நோக்கம்.' },
              { start: 36, end: 60, text: 'கட்டமைப்பு மேப்பிங்கை தொடங்குவதற்கு உங்கள் டிரேடிங் ஜர்னலை தயார் செய்து கொள்ளுங்கள்.' }
            ]
          },
          {
            id: 'tanglish',
            label: 'Tamil (Tanglish)',
            lang: 'tanglish',
            cues: [
              { start: 0, end: 15, text: 'VYROX Institutional SMC Foundations program-ku ungalai anbudan varaverkirom.' },
              { start: 16, end: 35, text: 'Retail patterns vitutu, institutional smart money eppadi execute panranganu purinjikalam.' },
              { start: 36, end: 60, text: 'Unga trading journal eduthu vechikonga, session start panalam.' }
            ]
          }
        ]
      },
      {
        id: 'lesson_f2',
        courseId: 'course_smc_foundations',
        title: '2. Introduction to Institutional Order Flow',
        titleTamil: '2. நிறுவன ஆர்டர் ஃப்ளோ அறிமுகம்',
        durationMinutes: 12,
        durationSeconds: 40,
        videoDurationFormatted: '12:40',
        isFreePreview: true,
        order: 2,
        description: 'Understanding how large institutions cannot enter markets at once and must accumulate orders by inducing retail stop runs.',
        keyTakeaways: [
          'Institutions require counterpart liquidity to fill massive lots',
          'Difference between trending volume and engineered consolidation',
          'Why retail breakout traders are systematically stopped out'
        ],
        subtitles: [
          {
            id: 'en',
            label: 'English',
            lang: 'en',
            cues: [
              { start: 0, end: 20, text: 'Look closely at this 15-minute timeframe chart on EUR/USD.' },
              { start: 21, end: 45, text: 'Notice how the high was swept before an aggressive downward displacement.' },
              { start: 46, end: 90, text: 'That initial sweep is not a breakout. It is Buy-Side Liquidity engineering.' },
              { start: 91, end: 150, text: 'Once retail stop-losses trigger as buy orders, smart money takes the opposite short side.' }
            ]
          },
          {
            id: 'ta',
            label: 'தமிழ் (Tamil)',
            lang: 'ta',
            cues: [
              { start: 0, end: 20, text: 'EUR/USD இன் 15 நிமிட சார்ட்டை கவனமாக பாருங்கள்.' },
              { start: 21, end: 45, text: 'கடுமையான இறக்கத்திற்கு முன் எவ்வாறு முந்தைய ஹை (High) துடைக்கப்பட்டது என்பதை கவனியுங்கள்.' },
              { start: 46, end: 90, text: 'இது பிரேக்அவுட் அல்ல; இது Buy-Side Liquidity கவர்வதாகும்.' },
              { start: 91, end: 150, text: 'ரீடெயில் ஸ்டாப்லாஸ்கள் தூண்டப்பட்டவுடன், இன்ஸ்டிட்யூஷன்ஸ் தனது ஷார்ட் பொசிஷனை நிரப்புகிறது.' }
            ]
          },
          {
            id: 'tanglish',
            label: 'Tamil (Tanglish)',
            lang: 'tanglish',
            cues: [
              { start: 0, end: 20, text: 'EUR/USD 15-minute chart-la inga paathiga theriyum.' },
              { start: 21, end: 45, text: 'Periya drop aagurathukku munnadi, antha high point-a sweep panirkanga.' },
              { start: 46, end: 90, text: 'Ithu breakout kedaiyathu, Buy-Side Liquidity grab panra move ithu.' },
              { start: 91, end: 150, text: 'Retail stoploss hit aanathum, institutional smart money short positions execute panranga.' }
            ]
          }
        ]
      },
      {
        id: 'lesson_f3',
        courseId: 'course_smc_foundations',
        title: '3. Market Structure Basics: BOS vs CHoCH',
        titleTamil: '3. மார்க்கெட் கட்டமைப்பு: BOS vs CHoCH',
        durationMinutes: 15,
        durationSeconds: 20,
        videoDurationFormatted: '15:20',
        isFreePreview: false,
        order: 3,
        description: 'Precise rules for candle body closes versus wick rejections to confirm genuine market trend continuation or reversal.',
        keyTakeaways: [
          'Candle body closure is mandatory for confirmed BOS',
          'CHoCH signals first structural shift against prevailing trend',
          'Internal structure vs external macro frame alignment'
        ],
        subtitles: [
          {
            id: 'en',
            label: 'English',
            lang: 'en',
            cues: [
              { start: 0, end: 30, text: 'A wick past a high is simply a liquidity raid, never a confirmed BOS.' },
              { start: 31, end: 70, text: 'Only a full candle body close above confirms continuation.' }
            ]
          }
        ]
      },
      {
        id: 'lesson_f4',
        courseId: 'course_smc_foundations',
        title: '4. Reading Liquidity: BSL, SSL and Internal Range',
        titleTamil: '4. லிக்விடிட்டி கண்டறிதல்: BSL & SSL',
        durationMinutes: 18,
        durationSeconds: 10,
        videoDurationFormatted: '18:10',
        isFreePreview: false,
        order: 4,
        description: 'Mapping where the herd places stop losses and understanding why liquidity is the real fuel behind market moves.',
        keyTakeaways: [
          'Equal Highs (EQH) and Equal Lows (EQL) are primary magnetic targets',
          'Internal range liquidity draws into external range targets',
          'Session highs/lows: Asian session sweep mechanics'
        ],
        subtitles: []
      },
      {
        id: 'lesson_f5',
        courseId: 'course_smc_foundations',
        title: '5. Fair Value Gaps (FVG) and Imbalance Mechanics',
        titleTamil: '5. ஃபேர் வேல்யூ கேப் (FVG) மற்றும் சமநிலையின்மை',
        durationMinutes: 14,
        durationSeconds: 45,
        videoDurationFormatted: '14:45',
        isFreePreview: false,
        order: 5,
        description: 'Identifying three-candle imbalances and how algorithms reprice back to equilibrium before resuming trend.',
        keyTakeaways: [
          'Three-candle pattern definition of FVG',
          'Consequent Encroachment (50% midpoint) as optimal reaction zone',
          'Inversion Fair Value Gaps (IFVG)'
        ],
        subtitles: []
      },
      {
        id: 'lesson_f6',
        courseId: 'course_smc_foundations',
        title: '6. Premium vs Discount Zones & Fibonacci Equilibrium',
        titleTamil: '6. பிரீமியம் & டிஸ்கவுண்ட் மண்டலங்கள்',
        durationMinutes: 16,
        durationSeconds: 30,
        videoDurationFormatted: '16:30',
        isFreePreview: false,
        order: 6,
        description: 'Never buy in premium; never sell in discount. Applying algorithmic pricing rules to your trading plans.',
        keyTakeaways: [
          '50% equilibrium calculation',
          'Optimal Trade Entry (OTE) 62% - 79% zone',
          'Combining OTE with high-timeframe points of interest (POI)'
        ],
        subtitles: []
      }
    ]
  },
  {
    id: 'course_order_blocks',
    title: 'Order Blocks & High-Probability Entries',
    tagline: 'Deep dive into institutional footprinting, breaker blocks, propulsion blocks, and sniper LTF confirmation entries.',
    badge: 'Advanced',
    tier: 'paid',
    price: 6499,
    originalPrice: 11999,
    rating: 4.95,
    studentCount: 940,
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
    description: 'Transform theoretical knowledge into actionable execution. Discover how to identify true institutional order blocks from decoy candles and refine entry triggers down to 1-minute and 5-minute charts.',
    level: 'Intermediate',
    learningOutcomes: [
      'Validate genuine order blocks with imbalance and volume displacement',
      'Execute Breaker Block setups after liquidity grabs',
      'Refine daily and 4H zones to 1-minute sniper entry models',
      'Achieve minimum 1:4 Risk to Reward on intraday executions'
    ],
    lessons: [
      {
        id: 'lesson_ob1',
        courseId: 'course_order_blocks',
        title: '1. What Makes a Valid Institutional Order Block?',
        durationMinutes: 16,
        durationSeconds: 20,
        videoDurationFormatted: '16:20',
        isFreePreview: true,
        order: 1,
        description: 'The exact anatomy of the last buying candle before institutional down-move with displacement.',
        keyTakeaways: ['Displacement validation', 'Imbalance creation', 'Liquidity absorption'],
        subtitles: []
      },
      {
        id: 'lesson_ob2',
        courseId: 'course_order_blocks',
        title: '2. Breaker Blocks vs Mitigation Blocks',
        durationMinutes: 19,
        durationSeconds: 40,
        videoDurationFormatted: '19:40',
        isFreePreview: false,
        order: 2,
        description: 'How failed order blocks become high-probability support/resistance flip levels.',
        keyTakeaways: ['Stop-loss cascade mechanics', 'Breaker formation criteria'],
        subtitles: []
      },
      {
        id: 'lesson_ob3',
        courseId: 'course_order_blocks',
        title: '3. LTF Refinement: 15m to 1m Confirmation',
        durationMinutes: 22,
        durationSeconds: 15,
        videoDurationFormatted: '22:15',
        isFreePreview: false,
        order: 3,
        description: 'Multi-timeframe fractal alignment to lower risk from 30 pips to under 5 pips.',
        keyTakeaways: ['Fractal nature of market', 'Change of character on LTF inside HTF POI'],
        subtitles: []
      }
    ]
  },
  {
    id: 'course_risk_mastery',
    title: 'Risk & Trade Planning Mastery',
    tagline: 'Professional capital preservation, asymmetric 1:5+ R:R setups, position sizing calculus, and emotional discipline.',
    badge: 'Mastery',
    tier: 'paid',
    price: 3999,
    originalPrice: 6999,
    rating: 4.88,
    studentCount: 780,
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    description: 'The differentiator between profitable institutional traders and liquidated retail participants is disciplined risk management and systematic trade journaling.',
    level: 'Professional',
    learningOutcomes: [
      'Calculate dynamic lot sizes tailored to account equity and stop loss pips',
      'Establish strict maximum drawdown thresholds (max 1% per day)',
      'Manage partial take profits at liquidity pools while holding runners',
      'Build a repeatable institutional trading journal'
    ],
    lessons: [
      {
        id: 'lesson_rm1',
        courseId: 'course_risk_mastery',
        title: '1. The Mathematics of Asymmetric Risk:Reward',
        durationMinutes: 14,
        durationSeconds: 10,
        videoDurationFormatted: '14:10',
        isFreePreview: true,
        order: 1,
        description: 'Why a 40% win rate generates massive profitability with 1:3 and 1:5 setups.',
        keyTakeaways: ['Expectancy equation', 'Risk per trade rules (0.5% - 1%)'],
        subtitles: []
      },
      {
        id: 'lesson_rm2',
        courseId: 'course_risk_mastery',
        title: '2. Professional Position Sizing & Margin Calculation',
        durationMinutes: 18,
        durationSeconds: 30,
        videoDurationFormatted: '18:30',
        isFreePreview: false,
        order: 2,
        description: 'Automating lot size calculations to never risk unexpected capital.',
        keyTakeaways: ['Contract specifications', 'Spread and slippage buffering'],
        subtitles: []
      }
    ]
  },
  {
    id: 'course_liquidity_mastery',
    title: 'Advanced Liquidity & Inducements',
    tagline: 'Master engineered liquidity, Asian range sweeps, London expansion, and NY reversal algorithms.',
    badge: 'Advanced',
    tier: 'paid',
    price: 7999,
    originalPrice: 13999,
    rating: 4.97,
    studentCount: 520,
    thumbnail: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=800&q=80',
    description: 'Learn the exact liquidity blueprint: Judas swings, London open runs, high-impact news sweeps, and inducement traps that fool 95% of traders.',
    level: 'Professional',
    learningOutcomes: [
      'Identify Inducement (IDM) before taking premature entries',
      'Trade the London Open Judas swing with precision',
      'Understand how news events are used to deliver liquidity to HTF POIs',
      'Synthesize multi-pair institutional correlation'
    ],
    lessons: [
      {
        id: 'lesson_lq1',
        courseId: 'course_liquidity_mastery',
        title: '1. Anatomy of Market Inducement (IDM)',
        durationMinutes: 20,
        durationSeconds: 15,
        videoDurationFormatted: '20:15',
        isFreePreview: false,
        order: 1,
        description: 'How smart money creates pseudo-order blocks to induce early entries.',
        keyTakeaways: ['First pullback recognition', 'Valid IDM marking'],
        subtitles: []
      }
    ]
  }
];

export const FREE_INTRO_VIDEOS = [
  {
    id: 'free_vid_1',
    title: 'What is Smart Money Concepts? (SMC vs Retail)',
    duration: '08:20',
    views: '18.4K',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
    summary: 'Understanding institutional market participants, central bank dealers, and why support/resistance lines fail.'
  },
  {
    id: 'free_vid_2',
    title: 'Market Structure Basics: BOS vs CHoCH Explained',
    duration: '11:05',
    views: '24.1K',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=400&q=80',
    summary: 'The fundamental difference between trend continuation and structural market reversal in institutional trading.'
  },
  {
    id: 'free_vid_3',
    title: 'Reading Institutional Liquidity: BSL & SSL Pools',
    duration: '09:40',
    views: '15.9K',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80',
    summary: 'Where retail stops accumulate and how algorithmic market makers hunt equal highs and equal lows.'
  },
  {
    id: 'free_vid_4',
    title: 'Understanding Order Blocks & Mitigation Zones',
    duration: '14:15',
    views: '31.2K',
    thumbnail: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=400&q=80',
    summary: 'High-probability order block validation criteria: displacement, imbalance, and reaction test.'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_ment_1',
    roomId: 'mentorship',
    senderId: 'usr_mentor_rahul',
    senderName: 'Rahul (Senior SMC Mentor)',
    senderRole: 'mentor',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    text: 'Hello Arun! Welcome to your 1-on-1 private mentorship channel. You can upload chart screenshots of your markups here for feedback. What currency pair or asset are you currently analyzing?',
    timestamp: 'Yesterday, 04:30 PM'
  },
  {
    id: 'msg_ment_2',
    roomId: 'mentorship',
    senderId: 'usr_arun_7781',
    senderName: 'Arun Kumar',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    text: 'Hi Rahul sir, I marked this 15-minute EUR/USD order block right after the London session liquidity sweep. Can you check if my mitigation entry level is valid?',
    timestamp: 'Today, 09:15 AM',
    attachment: {
      name: 'EURUSD_15m_Marked_OB.png',
      size: '2.4 MB',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'msg_ment_3',
    roomId: 'mentorship',
    senderId: 'usr_mentor_rahul',
    senderName: 'Rahul (Senior SMC Mentor)',
    senderRole: 'mentor',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    text: 'Great observation on the London high sweep! Notice however that the candle directly preceding the displacement left an unfilled FVG between 1.0845 and 1.0850. Wait for price to tap that 50% consequent encroachment before placing your limit order. Good discipline!',
    timestamp: 'Today, 10:02 AM'
  },
  // Community General Discussion
  {
    id: 'msg_gen_1',
    roomId: 'general',
    senderId: 'usr_karthik_99',
    senderName: 'Karthik V.',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    text: 'Nifty swept previous day high and created clean 5m CHoCH today at 9:45 AM. textbook SMC reversal setup!',
    timestamp: '10:45 AM',
    likes: 6
  },
  {
    id: 'msg_gen_2',
    roomId: 'general',
    senderId: 'usr_priya_44',
    senderName: 'Priya Sundar',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    text: 'Yes! BankNifty also reached discount zone of the 15m order block. Lesson 5 FVG rule worked perfectly.',
    timestamp: '11:10 AM',
    likes: 4
  },
  {
    id: 'msg_gen_3',
    roomId: 'general',
    senderId: 'usr_mentor_rahul',
    senderName: 'Rahul (Senior SMC Mentor)',
    senderRole: 'mentor',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    text: 'Reminder to all students: As per SEBI educational guidelines and academy rules, kindly share structural chart analysis only. Do not post buy/sell signals or target price recommendations.',
    timestamp: '11:15 AM',
    likes: 18
  }
];

export const INITIAL_PAYMENTS_QUEUE: PaymentTransaction[] = [
  {
    id: 'pay_vx_9011',
    orderRef: 'VYR-ORD-2026-9011',
    studentId: 'usr_arun_7781',
    studentName: 'Arun Kumar',
    studentEmail: 'nandhakumar052007@gmail.com',
    courseId: 'course_smc_foundations',
    courseName: 'SMC Foundations & Market Structure',
    amount: 4999,
    method: 'gpay_upi',
    transactionId: 'UPI-429810481239',
    date: '04 Nov 2026, 14:10',
    status: 'verified',
    verifiedBy: 'Suresh (Payments Admin)'
  },
  {
    id: 'pay_vx_9012',
    orderRef: 'VYR-ORD-2026-9012',
    studentId: 'usr_karthik_99',
    studentName: 'Karthik V.',
    studentEmail: 'karthik.trader@gmail.com',
    courseId: 'course_order_blocks',
    courseName: 'Order Blocks & High-Probability Entries',
    amount: 6499,
    method: 'binance_uid',
    transactionId: 'BINANCE-TX-88912401',
    date: 'Today, 09:30',
    status: 'pending'
  },
  {
    id: 'pay_vx_9013',
    orderRef: 'VYR-ORD-2026-9013',
    studentId: 'usr_vikram_21',
    studentName: 'Vikram Seth',
    studentEmail: 'vikram.seth99@outlook.com',
    courseId: 'course_risk_mastery',
    courseName: 'Risk & Trade Planning Mastery',
    amount: 3999,
    method: 'gpay_upi',
    transactionId: 'UPI-591029482910',
    date: 'Today, 10:15',
    status: 'pending'
  },
  {
    id: 'pay_vx_9014',
    orderRef: 'VYR-ORD-2026-9014',
    studentId: 'usr_ananya_33',
    studentName: 'Ananya Sharma',
    studentEmail: 'ananya.s@gmail.com',
    courseId: 'course_liquidity_mastery',
    courseName: 'Advanced Liquidity & Inducements',
    amount: 7999,
    method: 'gpay_upi',
    transactionId: 'UPI-984029104821',
    date: 'Today, 10:48',
    status: 'pending'
  }
];

export const INITIAL_DEVICE_REQUESTS: DeviceChangeRequest[] = [
  {
    id: 'dreq_108',
    studentId: 'usr_sanjay_55',
    studentName: 'Sanjay Krishnan',
    studentEmail: 'sanjay.krish@gmail.com',
    requestedAt: 'Today, 08:45',
    reason: 'Bought new laptop for trading station; previous Windows machine hard drive crashed.',
    oldDevice: {
      id: 'DEV-WIN-102',
      deviceName: 'Dell Inspiron 15',
      model: 'Windows 11',
      os: 'Windows 11 Home',
      browser: 'Firefox 124.0',
      ipAddress: '49.207.182.14',
      location: 'Coimbatore, Tamil Nadu',
      lastActive: '02 Nov, 18:20',
      isCurrent: false,
      status: 'active'
    },
    newDevice: {
      id: 'DEV-MAC-409',
      deviceName: 'Apple MacBook Pro M3',
      model: 'MacBookPro18,3',
      os: 'macOS Sonoma 14.4',
      browser: 'Safari 17.4',
      ipAddress: '49.207.182.91',
      location: 'Coimbatore, Tamil Nadu',
      lastActive: 'Requested',
      isCurrent: false,
      status: 'pending_review'
    },
    status: 'pending'
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep_301',
    messageId: 'msg_flag_81',
    messageSnippet: 'Guaranteed 500% profit signal group on Telegram! DM me to join VIP pump!',
    reportedUserId: 'usr_crypto_bot9',
    reportedUserName: 'TraderAlex_Signals',
    reportedBy: 'Karthik V.',
    reason: 'spam',
    timestamp: 'Today, 09:20',
    status: 'open'
  },
  {
    id: 'rep_302',
    messageId: 'msg_flag_82',
    messageSnippet: 'Buy BankNifty 48500 CE right now heavy targets 49000 stop loss 48400 quick!',
    reportedUserId: 'usr_tips_guy',
    reportedUserName: 'NiftyRider99',
    reportedBy: 'Priya Sundar',
    reason: 'financial_tip',
    timestamp: 'Today, 10:05',
    status: 'open'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_901',
    timestamp: 'Today, 10:48 AM',
    actor: 'System',
    actorRole: 'System Security',
    action: 'DEVICE_HEARTBEAT',
    target: 'Arun Kumar (DEV-A54-8902)',
    details: 'Verified single active device session token over TLS 1.3.',
    ipAddress: '103.21.124.89',
    severity: 'low'
  },
  {
    id: 'aud_902',
    timestamp: 'Today, 10:15 AM',
    actor: 'Suresh (Payments Admin)',
    actorRole: 'payments_admin',
    action: 'PAYMENT_VERIFIED',
    target: 'Order VYR-ORD-2026-9011 (₹4,999)',
    details: 'Matched UPI UTR 429810481239 with bank ledger. Granted SMC Foundations enrollment.',
    ipAddress: '182.72.19.45',
    severity: 'medium'
  },
  {
    id: 'aud_903',
    timestamp: '04 Nov, 14:22 PM',
    actor: 'Arun Kumar',
    actorRole: 'student',
    action: 'PAYMENT_DETAILS_UPDATED',
    target: 'User Profile usr_arun_7781',
    details: 'Updated GPay UPI ID nandhakumar052007@okaxis and Binance UID 1129930138.',
    ipAddress: '103.21.124.89',
    severity: 'medium'
  },
  {
    id: 'aud_904',
    timestamp: '03 Nov, 11:00 AM',
    actor: 'Owner Admin',
    actorRole: 'owner_admin',
    action: 'ADMIN_2FA_SESSION_GRANTED',
    target: 'Console Session #8812',
    details: '6-digit TOTP authenticated successfully. Full audit trail initiated.',
    ipAddress: '182.72.19.45',
    severity: 'high'
  }
];

export const DISCUSSION_CATEGORIES: DiscussionCategory[] = [
  'General Trading Discussions',
  'Chart Analysis',
  'Entry Discussions',
  'SMC Discussions',
  'Trade Setups',
  'Trade Reviews',
  'Trading Psychology',
  'Risk Management',
  'Market Discussions',
  'Questions & Doubts',
  'Mistakes & Lessons',
  'Strategy Discussions'
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc_1',
    title: 'XAUUSD 15M London Sweep + Bullish CHoCH Confirmation (1:4.8 RR)',
    content: `Gold swept yesterday's Sell-Side Liquidity (SSL) during the London open, followed immediately by strong displacement leaving an unfilled 15m Fair Value Gap (FVG) at 2732.40.

**Execution Blueprint:**
1. Wait for 50% Consequent Encroachment (CE) tap.
2. Invalidation strictly below the sweep wick (2728.10).
3. Primary take profit at the Asian high liquidity pool (2750.00).

Let me know your thoughts on whether Asian session high will act as strong resistance or fuel for expansion!`,
    category: 'Chart Analysis',
    symbol: 'XAUUSD',
    tags: ['CHoCH', 'LondonSweep', 'FVG', 'Liquidity'],
    chartImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
    chartCaption: 'XAUUSD 15m: Clean mitigation into London FVG after liquidity raid',
    authorId: 'usr_mentor_rahul',
    authorName: 'Rahul (Senior SMC Mentor)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Mentor',
    createdAt: 'Today, 08:30 AM',
    likes: 24,
    dislikes: 1,
    userVote: 'like',
    isBookmarked: true,
    isPinned: true,
    views: 342,
    commentsCount: 3,
    comments: [
      {
        id: 'comm_1_1',
        discussionId: 'disc_1',
        authorId: 'usr_arun_7781',
        authorName: 'Arun Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'Rahul sir, would you consider the 5m Order Block inside that 15m FVG as an aggressive entry, or is limit order at 50% CE safer?',
        createdAt: 'Today, 09:12 AM',
        likes: 5,
        likedByUser: false
      },
      {
        id: 'comm_1_2',
        discussionId: 'disc_1',
        authorId: 'usr_mentor_rahul',
        authorName: 'Rahul (Senior SMC Mentor)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Mentor',
        content: 'Good question Arun. If you want lower drawdown, wait for the 1m micro-CHoCH confirmation inside the 5m OB. That keeps your risk under 25 pips on Gold.',
        createdAt: 'Today, 09:25 AM',
        likes: 8,
        likedByUser: true,
        replyToCommentId: 'comm_1_1',
        replyToAuthorName: 'Arun Kumar'
      },
      {
        id: 'comm_1_3',
        discussionId: 'disc_1',
        authorId: 'usr_karthik_99',
        authorName: 'Karthik V.',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Pro Trader',
        content: 'Took this exact setup at 2733.20! Target hit cleanly before NY open news. Textbook SMC liquidity raid.',
        createdAt: 'Today, 10:40 AM',
        likes: 3,
        likedByUser: false
      }
    ]
  },
  {
    id: 'disc_2',
    title: 'US30 (Dow Jones) Judas Swing Strategy During New York Open',
    content: `Many retail traders get trapped buying the initial 9:30 AM EST 5-minute green breakout on US30. 

In institutional SMC theory, the first 15 minutes of NY cash open is predominantly a **Judas Swing** designed to induce breakout retail traders before smart money sweeps them and moves opposite.

Notice how the institutional algorithm:
- Pushes up into the Asian session Equal Highs (EQH)
- Wicks through to trigger buy-stop orders
- Delivers sharp displacement lower through the opening price range (ERL to IRL).

How do you handle NY open volatility on indices?`,
    category: 'Market Discussions',
    symbol: 'US30',
    tags: ['JudasSwing', 'NYOpen', 'Indices', 'LiquiditySweep'],
    chartImageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80',
    chartCaption: 'US30 5m: Classic Judas Swing engineered at 9:30 AM EST',
    authorId: 'usr_karthik_99',
    authorName: 'Karthik V.',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Pro Trader',
    createdAt: 'Yesterday, 06:15 PM',
    likes: 19,
    dislikes: 0,
    userVote: null,
    isBookmarked: false,
    views: 289,
    commentsCount: 2,
    comments: [
      {
        id: 'comm_2_1',
        discussionId: 'disc_2',
        authorId: 'usr_priya_44',
        authorName: 'Priya Sundar',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'I always sit on my hands until 10:00 AM EST (the Silver Bullet window). Waiting for the initial sweep saved my account multiple times.',
        createdAt: 'Yesterday, 07:10 PM',
        likes: 6,
        likedByUser: false
      },
      {
        id: 'comm_2_2',
        discussionId: 'disc_2',
        authorId: 'usr_suresh_88',
        authorName: 'Suresh Menon',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'Completely agree. US30 requires minimum 50 pip buffer on stop loss if entering without LTF CHoCH.',
        createdAt: 'Yesterday, 08:05 PM',
        likes: 2,
        likedByUser: false
      }
    ]
  },
  {
    id: 'disc_3',
    title: 'Why Most Traders Misidentify BOS vs CHoCH (Detailed Diagram)',
    content: `One of the most common errors in SMC community chart submissions is confusing internal pullback sweeps with true structural breaks.

**Golden Rules from VYROX Curriculum:**
1. A wick past a swing point is a **Liquidity Grab / Purge**, NOT a confirmed BOS.
2. Only a full candle **BODY CLOSE** beyond the swing high/low confirms structural trend continuation.
3. If price only wicks beyond and closes back inside, anticipate an immediate Change of Character (CHoCH) in the opposite direction!

Study the attached chart markup showing the exact difference.`,
    category: 'SMC Discussions',
    symbol: 'EURUSD',
    tags: ['BOS', 'CHoCH', 'MarketStructure', 'OrderFlow'],
    chartImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80',
    chartCaption: 'Candle body close validation vs wick liquidity sweeps',
    authorId: 'usr_mentor_rahul',
    authorName: 'Rahul (Senior SMC Mentor)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Mentor',
    createdAt: '03 Nov 2026',
    likes: 42,
    dislikes: 0,
    userVote: 'like',
    isBookmarked: true,
    views: 610,
    commentsCount: 1,
    comments: [
      {
        id: 'comm_3_1',
        discussionId: 'disc_3',
        authorId: 'usr_arun_7781',
        authorName: 'Arun Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'This single rule changed my win rate from 38% to 58%. Waiting for the body close filtered out all fakeouts!',
        createdAt: '03 Nov, 03:40 PM',
        likes: 11,
        likedByUser: true
      }
    ]
  },
  {
    id: 'disc_4',
    title: 'Overcoming Revenge Trading: My 2-Trade Maximum Daily Rule',
    content: `Last month I took 4 losing trades in a row during the London session and ended up losing 8% of my account because I tried to "win it back" on US30 at NY open.

I instituted a strict rule:
- Maximum 2 trades per day.
- Maximum 1% total daily risk (0.5% per trade).
- If both trades stop out, terminal shuts down automatically until next morning's London open.

Since adopting this, my drawdown stopped and I closed the last 3 weeks in green. Anyone else struggled with this psychological trigger?`,
    category: 'Trading Psychology',
    symbol: 'ALL',
    tags: ['Discipline', 'RevengeTrading', 'RiskManagement', 'Psychology'],
    authorId: 'usr_arun_7781',
    authorName: 'Arun Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Verified Student',
    createdAt: '02 Nov 2026',
    likes: 31,
    dislikes: 1,
    userVote: null,
    isBookmarked: false,
    views: 450,
    commentsCount: 2,
    comments: [
      {
        id: 'comm_4_1',
        authorId: 'usr_mentor_rahul',
        discussionId: 'disc_4',
        authorName: 'Rahul (Senior SMC Mentor)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Mentor',
        content: 'Proud of your discipline, Arun. Trading is 20% strategy and 80% emotional capital preservation. A 2-trade circuit breaker is what separates professionals from gamblers.',
        createdAt: '02 Nov, 05:15 PM',
        likes: 14,
        likedByUser: false
      },
      {
        id: 'comm_4_2',
        discussionId: 'disc_4',
        authorId: 'usr_vikram_21',
        authorName: 'Vikram Seth',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'I have the same problem with Gold. Setting a hard limit on TradingView helped me tremendously.',
        createdAt: '02 Nov, 07:30 PM',
        likes: 4,
        likedByUser: false
      }
    ]
  },
  {
    id: 'disc_5',
    title: 'GBPUSD 4H Order Block Breaker Setup Analysis (1.2980 Target)',
    content: `GBP/USD on 4H rejected off the bearish breaker block at 1.3040. Notice how the previous bullish order block failed to hold price and broke downward with strong momentum candle.

This converts the zone into a high-probability Breaker Block for short continuation into 1.2980 SSL.

Are you looking for shorts or waiting for higher timeframe mitigation?`,
    category: 'Trade Setups',
    symbol: 'GBPUSD',
    tags: ['BreakerBlock', 'GBPUSD', 'TradeSetup', '4HStructure'],
    chartImageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=900&q=80',
    chartCaption: 'GBPUSD 4H Breaker Block retest with targeted sell-side liquidity',
    authorId: 'usr_priya_44',
    authorName: 'Priya Sundar',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Verified Student',
    createdAt: '01 Nov 2026',
    likes: 15,
    dislikes: 0,
    userVote: null,
    isBookmarked: false,
    views: 215,
    commentsCount: 1,
    comments: [
      {
        id: 'comm_5_1',
        discussionId: 'disc_5',
        authorId: 'usr_karthik_99',
        authorName: 'Karthik V.',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Pro Trader',
        content: 'Clean setup Priya. Watching 15m CHoCH at the breaker block before pulling trigger.',
        createdAt: '01 Nov, 04:20 PM',
        likes: 3,
        likedByUser: false
      }
    ]
  }
];

// ==========================================
// MENTOR VIDEO CATEGORIES (12 Categories)
// ==========================================
export const MENTOR_VIDEO_CATEGORIES: MentorVideoCategory[] = [
  'SMC Concepts',
  'Market Structure',
  'Liquidity Concepts',
  'BOS & CHOCH',
  'MSS & Entry Models',
  'FVG & Order Blocks',
  'Chart Analysis',
  'Live Market Analysis',
  'Trade Reviews',
  'Trading Psychology',
  'Risk Management',
  'Strategy Development'
];

// ==========================================
// INITIAL COUPONS CONFIGURATION
// ==========================================
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_vyrox20',
    code: 'VYROX20',
    discountType: 'percentage',
    discountValue: 20,
    applicablePlans: 'all',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 14,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    maxDiscountAmount: 150,
    status: 'active',
    description: '20% discount across all membership tiers (max ₹150 off)',
    createdAt: '01 Jan 2026'
  },
  {
    id: 'cpn_smc100',
    code: 'SMC100',
    discountType: 'fixed',
    discountValue: 100,
    applicablePlans: 'quarterly',
    startDate: '2026-02-01',
    expiryDate: '2026-11-30',
    usageLimit: 50,
    usedCount: 22,
    perUserLimit: 1,
    minPurchaseAmount: 300,
    status: 'active',
    description: 'Flat ₹100 off on Quarterly Membership plans',
    createdAt: '01 Feb 2026'
  },
  {
    id: 'cpn_welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    applicablePlans: 'monthly',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 45,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    maxDiscountAmount: 20,
    status: 'active',
    description: 'Welcome 10% discount on first month enrollment',
    createdAt: '01 Jan 2026'
  },
  {
    id: 'cpn_super50',
    code: 'SUPER50',
    discountType: 'fixed',
    discountValue: 50,
    applicablePlans: 'all',
    startDate: '2026-03-01',
    expiryDate: '2026-12-31',
    usageLimit: 80,
    usedCount: 31,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    status: 'active',
    description: 'Instant ₹50 voucher applicable on all membership terms',
    createdAt: '01 Mar 2026'
  },
  {
    id: 'cpn_expired30',
    code: 'EXPIRED30',
    discountType: 'percentage',
    discountValue: 30,
    applicablePlans: 'all',
    startDate: '2026-01-01',
    expiryDate: '2026-03-01',
    usageLimit: 20,
    usedCount: 20,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    status: 'inactive',
    description: 'Q1 Launch promotional discount (Expired & Inactive)',
    createdAt: '01 Jan 2026'
  }
];

export const INITIAL_COUPON_REDEMPTIONS: CouponRedemption[] = [
  {
    id: 'red_901',
    couponId: 'cpn_vyrox20',
    couponCode: 'VYROX20',
    studentId: 'usr_arun_7781',
    studentName: 'Arun Kumar',
    studentEmail: 'nandhakumar052007@gmail.com',
    planId: 'monthly',
    planName: 'Monthly Plan',
    originalPrice: 119,
    discountAmount: 23.8,
    finalPaidAmount: 95.2,
    redeemedAt: '04 Nov 2026, 14:10',
    orderRef: 'VYR-ORD-2026-9011'
  },
  {
    id: 'red_902',
    couponId: 'cpn_smc100',
    couponCode: 'SMC100',
    studentId: 'usr_karthik_99',
    studentName: 'Karthik V.',
    studentEmail: 'karthik.trader@gmail.com',
    planId: 'quarterly',
    planName: 'Quarterly Plan',
    originalPrice: 319,
    discountAmount: 100,
    finalPaidAmount: 219,
    redeemedAt: 'Yesterday, 09:30',
    orderRef: 'VYR-ORD-2026-9012'
  },
  {
    id: 'red_903',
    couponId: 'cpn_vyrox20',
    couponCode: 'VYROX20',
    studentId: 'usr_priya_44',
    studentName: 'Priya Sundar',
    studentEmail: 'priya.s@gmail.com',
    planId: 'yearly',
    planName: 'Yearly Plan',
    originalPrice: 1119,
    discountAmount: 150,
    finalPaidAmount: 969,
    redeemedAt: '02 Nov 2026, 11:20',
    orderRef: 'VYR-ORD-2026-9015'
  }
];

// ==========================================
// MENTORS DIRECTORY
// ==========================================
export const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'usr_mentor_rahul',
    name: 'Rahul (Senior SMC Mentor)',
    email: 'rahul.smc@vyroxacademy.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Former prop firm desk trader specializing in high-timeframe order flow, session liquidity raids, and algorithmic market structure.',
    experienceYears: 8,
    tradingExperience: '8+ Years Institutional FX & Commodities Desk',
    specialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    totalPublishedVideos: 18,
    totalViews: 14850,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'usr_karthik_99',
    name: 'Karthik V. (Pro Mentor)',
    email: 'karthik.trader@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Equities and US30 index scalper. Master of the 9:30 AM New York cash open Judas Swing and algorithmic displacement.',
    experienceYears: 5,
    tradingExperience: '5+ Years US30, NAS100 & Nifty Index Trading',
    specialization: 'Judas Swings, New York Open & Execution Timing',
    totalPublishedVideos: 12,
    totalViews: 9240,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Mar 2024'
  },
  {
    id: 'usr_priya_44',
    name: 'Priya Sundar (FX Specialist)',
    email: 'priya.sundar@vyroxacademy.in',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    shortBio: 'SMC macro analyst focusing on GBP/USD and EUR/USD breaker block formations, multi-timeframe alignment, and risk management.',
    experienceYears: 4,
    tradingExperience: '4+ Years European Session FX Strategy',
    specialization: 'Breaker Blocks, External to Internal Range Liquidity',
    totalPublishedVideos: 9,
    totalViews: 6710,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Jun 2024'
  },
  {
    id: 'usr_vikram_applicant',
    name: 'Vikram Seth (Applicant)',
    email: 'vikram.seth99@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Gold and Crude Oil swing trader applying for mentor privileges. Seeking upload permissions for Trade Reviews cohort.',
    experienceYears: 3,
    tradingExperience: '3 Years Commodities Swing Execution',
    specialization: 'Gold Supply & Demand + Volume Profiling',
    totalPublishedVideos: 0,
    totalViews: 0,
    isAuthorized: false,
    uploadPermissionGranted: false,
    status: 'pending_approval',
    joinedDate: 'Nov 2026'
  }
];

// ==========================================
// INITIAL MENTOR VIDEOS
// ==========================================
export const INITIAL_MENTOR_VIDEOS: MentorVideo[] = [
  {
    id: 'mvid_1',
    title: 'XAUUSD 15m London Sweep & Bullish CHoCH Entry Execution (1:4.8 RR)',
    description: `Detailed technical breakdown of how smart money swept London session sell-side liquidity at 2732.40 before generating clean displacement.

Key Learning Points:
• How to wait for 50% consequent encroachment tap inside the 15m Fair Value Gap.
• Invalidation strictly below the sweep wick at 2728.10.
• Target: Asian session high liquidity pool (2750.00).`,
    category: 'Chart Analysis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSeconds: 840, // 14 mins
    mentorId: 'usr_mentor_rahul',
    mentorName: 'Rahul (Senior SMC Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    instruments: ['XAUUSD'],
    tags: ['CHoCH', 'LondonSweep', 'FVG', 'Liquidity', 'Gold'],
    status: 'published',
    views: 1420,
    likes: 124,
    likedByUser: true,
    isBookmarked: true,
    uploadedAt: 'Today, 09:30 AM',
    commentsCount: 3,
    fileSizeMb: 145.2,
    comments: [
      {
        id: 'mv_comm_1_1',
        videoId: 'mvid_1',
        authorId: 'usr_arun_7781',
        authorName: 'Arun Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'Rahul sir, the explanation on waiting for the 1m micro-CHoCH inside the 5m OB saved me from premature entry today! Thank you!',
        createdAt: 'Today, 10:15 AM',
        likes: 12,
        likedByUser: false
      },
      {
        id: 'mv_comm_1_2',
        videoId: 'mvid_1',
        authorId: 'usr_mentor_rahul',
        authorName: 'Rahul (Senior SMC Mentor)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Senior Mentor',
        content: 'Excellent patience Arun. Never front-run the institutional algorithm. Wait for the confirmation print.',
        createdAt: 'Today, 10:30 AM',
        likes: 18,
        likedByUser: true,
        replyToCommentId: 'mv_comm_1_1',
        replyToAuthorName: 'Arun Kumar'
      }
    ]
  },
  {
    id: 'mvid_2',
    title: 'US30 (Dow Jones) 9:30 AM Cash Open Judas Swing Playbook',
    description: `How to avoid retail breakout traps during the first 15 minutes of the New York cash open on indices.

In this lesson:
• Why the 9:30 AM EST 5-minute green breakout is designed to engineer buy-side liquidity.
• Identifying equal highs (EQH) swept by smart money.
• Entering on the displacement return into the discount order block with 1:3.5 RR.`,
    category: 'MSS & Entry Models',
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationSeconds: 1120, // 18m 40s
    mentorId: 'usr_karthik_99',
    mentorName: 'Karthik V. (Pro Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Judas Swings & Execution Timing',
    instruments: ['US30'],
    tags: ['JudasSwing', 'US30', 'NYOpen', 'Indices', 'SMC'],
    status: 'published',
    views: 980,
    likes: 89,
    likedByUser: false,
    isBookmarked: false,
    uploadedAt: 'Yesterday, 06:15 PM',
    commentsCount: 1,
    fileSizeMb: 198.5,
    comments: [
      {
        id: 'mv_comm_2_1',
        videoId: 'mvid_2',
        authorId: 'usr_priya_44',
        authorName: 'Priya Sundar',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Mentor',
        content: 'Spot on Karthik. Watching the Silver Bullet window at 10:00 AM EST is essential.',
        createdAt: 'Yesterday, 07:45 PM',
        likes: 9,
        likedByUser: false
      }
    ]
  },
  {
    id: 'mvid_3',
    title: 'Valid BOS vs Wick Liquidity Sweep: Candle Body Close Rules',
    description: `The number one reason traders lose money in SMC is misidentifying internal pullbacks as true structural breaks.

Rules dissected:
1. Wick beyond high = Liquidity Purge (anticipate reversal CHoCH).
2. Candle BODY CLOSE = Valid structural trend continuation BOS.
3. Live chart examples on EURUSD and GBPUSD.`,
    category: 'BOS & CHOCH',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 730, // 12m 10s
    mentorId: 'usr_mentor_rahul',
    mentorName: 'Rahul (Senior SMC Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    instruments: ['EURUSD', 'GBPUSD'],
    tags: ['BOS', 'CHoCH', 'MarketStructure', 'OrderFlow'],
    status: 'published',
    views: 2180,
    likes: 195,
    likedByUser: true,
    isBookmarked: true,
    uploadedAt: '03 Nov 2026',
    commentsCount: 2,
    fileSizeMb: 110.0,
    comments: []
  },
  {
    id: 'mvid_4',
    title: 'Emotional Capital Preservation: The 2-Trade Daily Circuit Breaker',
    description: `Trading psychology mastery. Why having a strict maximum of 2 trades per day protects your psychological capital and prevents revenge trading spirals.

Contains:
• Daily risk cap framework (0.5% per trade, 1% total).
• Terminal shutdown triggers.
• How to stay disciplined during losing streaks.`,
    category: 'Trading Psychology',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    durationSeconds: 960, // 16m
    mentorId: 'usr_mentor_rahul',
    mentorName: 'Rahul (Senior SMC Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    instruments: ['ALL'],
    tags: ['Psychology', 'Discipline', 'RiskManagement', 'EmotionalCapital'],
    status: 'published',
    views: 1840,
    likes: 167,
    likedByUser: false,
    isBookmarked: false,
    uploadedAt: '02 Nov 2026',
    commentsCount: 1,
    fileSizeMb: 160.4,
    comments: []
  },
  {
    id: 'mvid_5',
    title: 'GBPUSD 4H Bearish Breaker Block Retest Execution (1.2980 Target)',
    description: `Multi-timeframe structural study on GBP/USD. How a failed bullish order block transitions into a high-conviction Breaker Block for short continuation into sell-side liquidity.`,
    category: 'Trade Reviews',
    thumbnailUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    durationSeconds: 680,
    mentorId: 'usr_priya_44',
    mentorName: 'Priya Sundar (FX Specialist)',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Breaker Blocks & Liquidity',
    instruments: ['GBPUSD'],
    tags: ['BreakerBlock', 'GBPUSD', 'TradeReview', '4HStructure'],
    status: 'published',
    views: 750,
    likes: 64,
    likedByUser: false,
    isBookmarked: false,
    uploadedAt: '01 Nov 2026',
    commentsCount: 0,
    fileSizeMb: 98.7,
    comments: []
  }
];

