// ESafety Intelligence Platform - Mock Data
// All data structures for demo purposes

export interface Term {
  term: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  definition: string;
  context: string;
  firstSeen: string;
  trendSpike: string;
  relatedTerms: string[];
  platforms: string[];
}

export interface Translation {
  id: number;
  input: string;
  timestamp: string;
  terms: Term[];
  conversationStarters: string[];
  resources: {
    title: string;
    type: string;
    url: string;
  }[];
}

export interface QuickExample {
  label: string;
  text: string;
}

export interface Narrative {
  id: number;
  title: string;
  icon: string;
  growth: string;
  platforms: string[];
  targetDemographic: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  examples: string[];
  recommendations: string[];
}

export interface WeeklyTrends {
  week: string;
  stats: {
    growth: string;
    newTerms: number;
    platforms: number;
    highRiskPercentage: number;
  };
  topNarratives: Narrative[];
  platformBreakdown: {
    tiktok: { percentage: number; trend: 'up' | 'down' | 'stable' };
    youtube: { percentage: number; trend: 'up' | 'down' | 'stable' };
    instagram: { percentage: number; trend: 'up' | 'down' | 'stable' };
    discord: { percentage: number; trend: 'up' | 'down' | 'stable' };
  };
  newTerms: string[];
}

export interface GlossaryTerm {
  term: string;
  riskLevel: 'low' | 'medium' | 'high';
  firstSeen: string;
  spike: string;
  definition: string;
  category: string;
}

// Quick example buttons for translator
export const quickExamples: QuickExample[] = [
  {
    label: 'Blackpill + Monk Mode',
    text: 'Just got blackpilled on dating, going monk mode'
  },
  {
    label: 'Looksmaxxing Journey',
    text: 'Mewing and mogging to PSL 7, looksmaxxing journey'
  },
  {
    label: 'Incel Language (High Risk)',
    text: 'Foids only want Chad, its all about LMS'
  }
];

// Translation examples with detailed term breakdowns
export const translations: Translation[] = [
  {
    id: 1,
    input: 'Just got blackpilled on dating, going monk mode',
    timestamp: '2024-12-11T10:30:00Z',
    terms: [
      {
        term: 'blackpilled',
        riskLevel: 'high',
        riskScore: 85,
        definition: 'Belief that dating/relationships are fundamentally hopeless for average men due to genetic factors like looks and height.',
        context: 'Gateway term to incel ideology. Often leads to nihilistic worldview and resentment toward women. Associated with communities that promote misogyny and victimhood.',
        firstSeen: '2014',
        trendSpike: '+230%',
        relatedTerms: ['redpill', 'incel', 'looksmaxxing', 'hypergamy'],
        platforms: ['Reddit', '4chan', 'TikTok', 'Discord']
      },
      {
        term: 'monk mode',
        riskLevel: 'medium',
        riskScore: 45,
        definition: 'Voluntarily avoiding romantic relationships to focus on self-improvement and personal goals.',
        context: 'Can be healthy or unhealthy depending on motivation. Often paired with MGTOW (Men Going Their Own Way) ideology, which can promote misogyny when taken to extremes.',
        firstSeen: '2016',
        trendSpike: '+120%',
        relatedTerms: ['MGTOW', 'self-improvement', 'redpill'],
        platforms: ['Reddit', 'YouTube']
      }
    ],
    conversationStarters: [
      'I noticed you mentioned feeling "blackpilled" about dating. What content have you been watching that makes you feel this way? Let\'s talk about where these ideas come from.',
      'The term "monk mode" is interesting. Are you feeling pressure to focus on self-improvement? Let\'s talk about healthy vs. unhealthy motivations for taking a break from dating.',
      'It sounds like you might be feeling frustrated about dating or relationships. What specific experiences have made you feel this way?'
    ],
    resources: [
      {
        title: 'Understanding Incel Ideology',
        type: 'guide',
        url: '/education/incel-ideology'
      },
      {
        title: 'Healthy Masculinity vs. Toxic Narratives',
        type: 'guide',
        url: '/education/healthy-masculinity'
      }
    ]
  },
  {
    id: 2,
    input: 'Mewing and mogging to PSL 7, looksmaxxing journey',
    timestamp: '2024-12-11T11:45:00Z',
    terms: [
      {
        term: 'mewing',
        riskLevel: 'low',
        riskScore: 25,
        definition: 'Tongue posture technique claimed to improve facial structure by pressing the tongue against the roof of the mouth.',
        context: 'Often gateway to obsessive appearance concerns and looksmaxxing communities. While the technique itself is relatively benign, it\'s frequently associated with toxic comparison culture.',
        firstSeen: '2018',
        trendSpike: '+450% (TikTok trend)',
        relatedTerms: ['looksmaxxing', 'mogging', 'PSL rating', 'jaw training'],
        platforms: ['TikTok', 'YouTube', 'Reddit']
      },
      {
        term: 'mogging',
        riskLevel: 'medium',
        riskScore: 55,
        definition: 'Being more attractive than someone else, dominating in looks. Derived from "AMOG" (Alpha Male of Group).',
        context: 'Promotes toxic comparison culture and hierarchical thinking about human worth based on appearance. Often used to rank people in dehumanizing ways.',
        firstSeen: '2016',
        trendSpike: '+180%',
        relatedTerms: ['heightmogging', 'framemogging', 'looksmaxxing', 'PSL'],
        platforms: ['TikTok', 'Reddit', 'Discord']
      },
      {
        term: 'PSL rating',
        riskLevel: 'medium',
        riskScore: 60,
        definition: 'Looks rating system (1-10 scale) from looksmaxxing forums like "Puahate", "Sluthate", and "Lookism".',
        context: 'Reduces human worth to numerical appearance scores. Often used to justify nihilistic views about dating and social value based solely on physical attractiveness.',
        firstSeen: '2015',
        trendSpike: '+90%',
        relatedTerms: ['looksmaxxing', 'incel', 'mogging', 'canthal tilt'],
        platforms: ['Reddit', 'Discord', 'Looksmaxxing forums']
      },
      {
        term: 'looksmaxxing',
        riskLevel: 'medium',
        riskScore: 50,
        definition: 'Maximizing physical appearance through various methods ranging from grooming to cosmetic surgery.',
        context: 'Can range from healthy self-care to obsessive body dysmorphia. Communities often promote extreme measures and reinforce beliefs that appearance determines all life outcomes.',
        firstSeen: '2014',
        trendSpike: '+310%',
        relatedTerms: ['mewing', 'mogging', 'PSL', 'blackpill', 'softmaxxing', 'hardmaxxing'],
        platforms: ['TikTok', 'YouTube', 'Reddit', 'Discord']
      }
    ],
    conversationStarters: [
      'I see you\'re interested in improving your appearance. That\'s natural, but I\'m concerned about the specific language you\'re using. Where are you learning these terms?',
      'Can we talk about where you\'re learning these techniques? Some online communities promote unhealthy obsession with looks that can lead to body dysmorphia.',
      'How do you feel about your appearance? Are you feeling pressure from social media or friends to look a certain way?'
    ],
    resources: [
      {
        title: 'Healthy Self-Improvement vs. Looksmaxxing Obsession',
        type: 'guide',
        url: '/education/healthy-self-improvement'
      },
      {
        title: 'Understanding Body Image in the Digital Age',
        type: 'guide',
        url: '/education/body-image'
      }
    ]
  },
  {
    id: 3,
    input: 'Foids only want Chad, its all about LMS - looks money status',
    timestamp: '2024-12-10T15:20:00Z',
    terms: [
      {
        term: 'foids',
        riskLevel: 'high',
        riskScore: 95,
        definition: 'Derogatory slang for women (short for "female humanoids" or "femoids").',
        context: 'Dehumanizing term used in incel communities to refer to women as less than human. This is an immediate red flag indicating exposure to extreme misogynistic content.',
        firstSeen: '2012',
        trendSpike: '+75%',
        relatedTerms: ['roastie', 'femoid', 'blackpill', 'incel'],
        platforms: ['4chan', 'Incel forums', 'Discord']
      },
      {
        term: 'Chad',
        riskLevel: 'medium',
        riskScore: 50,
        definition: 'Stereotypical attractive, successful man who easily attracts women. Often contrasted with "beta males".',
        context: 'Used in manosphere to describe perceived top-tier men in dating hierarchy. Part of a worldview that reduces relationships to genetic determinism.',
        firstSeen: '2008',
        trendSpike: '+120%',
        relatedTerms: ['Stacy', 'beta', 'alpha', 'blackpill', 'incel'],
        platforms: ['Reddit', 'TikTok', 'YouTube', '4chan']
      },
      {
        term: 'LMS',
        riskLevel: 'high',
        riskScore: 75,
        definition: 'Looks, Money, Status - belief that only these three factors matter in attraction and dating success.',
        context: 'Reductionist worldview that dehumanizes relationships and promotes cynical, transactional view of human connection. Common in red pill and incel communities.',
        firstSeen: '2014',
        trendSpike: '+90%',
        relatedTerms: ['redpill', 'blackpill', 'hypergamy', 'Chad', 'incel'],
        platforms: ['Reddit', 'YouTube', 'Forums']
      }
    ],
    conversationStarters: [
      'URGENT: The language in this message is deeply concerning. The term "foids" is dehumanizing toward women and strongly associated with incel ideology. We need to have a serious conversation about where you\'re encountering this content.',
      'This worldview (LMS theory) promotes toxic beliefs about relationships. I\'m concerned about what you\'re reading online. Can we talk about where these ideas are coming from?',
      'I want to understand what\'s making you feel this way about women and relationships. Have you had negative experiences, or is this coming from online communities?'
    ],
    resources: [
      {
        title: 'Understanding Incel Ideology and Its Dangers',
        type: 'urgent_guide',
        url: '/education/incel-ideology'
      },
      {
        title: 'How to Talk to Your Child About Misogyny Online',
        type: 'parent_guide',
        url: '/education/addressing-misogyny'
      },
      {
        title: 'Countering Extremist Narratives',
        type: 'urgent_guide',
        url: '/education/counter-narratives'
      }
    ]
  }
];

// Weekly trends dashboard data
export const weeklyTrends: WeeklyTrends = {
  week: 'Dec 4-11, 2024',
  stats: {
    growth: '+156%',
    newTerms: 23,
    platforms: 4,
    highRiskPercentage: 67
  },
  topNarratives: [
    {
      id: 1,
      title: 'Looksmaxxing Content Surge',
      icon: '🚨',
      growth: '+156%',
      platforms: ['TikTok', 'Instagram'],
      targetDemographic: 'Ages 13-17',
      riskLevel: 'high',
      description: 'Dramatic increase in "looksmaxxing" content targeting young teens. Videos promote obsessive focus on physical appearance, often tied to PSL ratings and toxic comparison culture. Content disguised as "self-improvement" advice.',
      examples: [
        '10 mewing exercises to ascend to PSL 7',
        'How I went from PSL 4 to PSL 7 in 6 months',
        'Ultimate looksmaxxing guide for teens',
        'Mogging your classmates: facial exercises',
        'Get hunter eyes and a sharp jawline'
      ],
      recommendations: [
        'Discuss healthy vs. unhealthy self-improvement',
        'Explore social media algorithms and how they amplify extreme content',
        'Watch for obsessive behavior around appearance',
        'Monitor time spent on appearance-focused content',
        'Encourage diverse interests beyond physical appearance'
      ]
    },
    {
      id: 2,
      title: 'Andrew Tate Copycat Accounts',
      icon: '⚠️',
      growth: '+89%',
      platforms: ['TikTok', 'YouTube Shorts'],
      targetDemographic: 'Ages 15-19',
      riskLevel: 'high',
      description: 'Despite bans, Andrew Tate\'s messaging proliferates through copycat accounts. New influencers adopt his rhetoric and style, promoting misogyny and toxic masculinity under the guise of "alpha male" content.',
      examples: [
        'Real alpha male traits women can\'t resist',
        'Why modern women are ruined (explained)',
        'Escape the matrix: the truth about dating',
        'Top G mindset: how to dominate life',
        'Why nice guys fail with women'
      ],
      recommendations: [
        'Discuss what healthy masculinity looks like',
        'Explore why these messages appeal to young men',
        'Address feelings of inadequacy or frustration',
        'Provide positive male role models',
        'Examine the business model behind these influencers'
      ]
    },
    {
      id: 3,
      title: 'Blackpill Terminology Normalization',
      icon: '📈',
      growth: '+67%',
      platforms: ['Discord', 'Reddit'],
      targetDemographic: 'Ages 16-21',
      riskLevel: 'high',
      description: 'Incel terminology increasingly used in mainstream gaming/meme communities. "Blackpill" references appear in seemingly unrelated content, normalizing nihilistic worldviews about relationships.',
      examples: [
        'Just accept the blackpill bro',
        'Why even try when it\'s all about looks',
        'Normies won\'t understand the blackpill truth',
        'Blackpilled on dating apps',
        'The brutal blackpill reality'
      ],
      recommendations: [
        'Understand what "blackpill" means and its dangers',
        'Address nihilistic thinking early',
        'Provide counter-narratives and hope',
        'Monitor Discord servers and online communities',
        'Discuss critical thinking about online ideologies'
      ]
    },
    {
      id: 4,
      title: 'Gaming Communities as Recruitment Vectors',
      icon: '🎮',
      growth: '+45%',
      platforms: ['Discord', 'Twitch'],
      targetDemographic: 'Ages 13-18',
      riskLevel: 'medium',
      description: 'Manosphere recruiters targeting gaming communities, especially Discord servers. Bonding over games used as entry point for introducing extremist ideologies.',
      examples: [
        'Discord servers mixing gaming with "redpill" channels',
        'Streamers subtly promoting manosphere talking points',
        'Gaming memes incorporating incel terminology',
        'Clan/guild chats sharing misogynistic content',
        'Gaming forums with off-topic blackpill discussions'
      ],
      recommendations: [
        'Monitor Discord servers and communities',
        'Discuss online friendships and influence',
        'Recognize when "jokes" become ideology',
        'Encourage diverse gaming communities',
        'Talk about healthy online interactions'
      ]
    },
    {
      id: 5,
      title: 'Red Pill Dating Advice Rebranding',
      icon: '💊',
      growth: '+38%',
      platforms: ['YouTube', 'Instagram'],
      targetDemographic: 'Ages 18-24',
      riskLevel: 'medium',
      description: 'Traditional "red pill" content repackaged as mainstream dating advice. Pickup artist techniques and manipulation tactics presented as confidence-building.',
      examples: [
        'The psychology of attraction (what they won\'t tell you)',
        'High-value man behaviors that attract women',
        'Why nice guys finish last (evolutionary psychology)',
        'Alpha male body language secrets',
        'The truth about female nature'
      ],
      recommendations: [
        'Discuss healthy relationships and consent',
        'Deconstruct manipulation tactics',
        'Explore authentic confidence vs. performative dominance',
        'Examine pseudoscience in dating advice',
        'Promote respect-based relationship approaches'
      ]
    }
  ],
  platformBreakdown: {
    tiktok: { percentage: 45, trend: 'up' },
    youtube: { percentage: 30, trend: 'stable' },
    instagram: { percentage: 15, trend: 'up' },
    discord: { percentage: 10, trend: 'up' }
  },
  newTerms: [
    'mogging',
    'mewing',
    'PSL rating',
    'framemogging',
    'heightmogging',
    'NT maxxing',
    'softmaxxing',
    'hardmaxxing',
    'chad lite',
    'beckies',
    'stacy lite',
    'based and redpilled',
    'cope',
    'rope',
    'ascend',
    'descend',
    'subhuman',
    'trucel',
    'volcel',
    'mentalcel',
    'wristcel',
    'currycel',
    'ricecel',
    'gigachad'
  ]
};

// Comprehensive glossary of manosphere terms
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Blackpill',
    riskLevel: 'high',
    firstSeen: '2014',
    spike: '+230%',
    definition: 'Nihilistic belief that success in dating is predetermined by genetics and physical appearance, making self-improvement futile.',
    category: 'Incel Ideology'
  },
  {
    term: 'Looksmaxxing',
    riskLevel: 'medium',
    firstSeen: '2014',
    spike: '+310%',
    definition: 'Maximizing physical appearance through various methods, from grooming to surgery.',
    category: 'Self-Improvement/Obsession'
  },
  {
    term: 'Incel',
    riskLevel: 'high',
    firstSeen: '2008',
    spike: '+45%',
    definition: 'Involuntary celibate - member of online community characterized by resentment and hostility towards women.',
    category: 'Incel Ideology'
  },
  {
    term: 'Mewing',
    riskLevel: 'low',
    firstSeen: '2018',
    spike: '+450%',
    definition: 'Tongue posture technique claimed to improve facial structure.',
    category: 'Looksmaxxing'
  },
  {
    term: 'Monk Mode',
    riskLevel: 'medium',
    firstSeen: '2016',
    spike: '+120%',
    definition: 'Voluntarily avoiding relationships to focus on self-improvement.',
    category: 'MGTOW/Self-Improvement'
  },
  {
    term: 'Mogging',
    riskLevel: 'medium',
    firstSeen: '2016',
    spike: '+180%',
    definition: 'Being more attractive than someone else, dominating in looks.',
    category: 'Looksmaxxing'
  },
  {
    term: 'Foids',
    riskLevel: 'high',
    firstSeen: '2012',
    spike: '+75%',
    definition: 'Derogatory slang for women (short for "female humanoids").',
    category: 'Incel Ideology'
  },
  {
    term: 'Chad',
    riskLevel: 'medium',
    firstSeen: '2008',
    spike: '+120%',
    definition: 'Stereotypical attractive, successful man who easily attracts women.',
    category: 'Manosphere Archetypes'
  },
  {
    term: 'Red Pill',
    riskLevel: 'high',
    firstSeen: '2012',
    spike: '+95%',
    definition: 'Accepting supposed harsh truths about women, dating, and society.',
    category: 'Pickup Artist/Red Pill'
  },
  {
    term: 'Beta Male',
    riskLevel: 'medium',
    firstSeen: '2010',
    spike: '+60%',
    definition: 'Man perceived as weak, submissive, or unsuccessful with women.',
    category: 'Manosphere Archetypes'
  },
  {
    term: 'Alpha Male',
    riskLevel: 'medium',
    firstSeen: '2009',
    spike: '+85%',
    definition: 'Dominant, confident man who is successful with women.',
    category: 'Manosphere Archetypes'
  },
  {
    term: 'Hypergamy',
    riskLevel: 'high',
    firstSeen: '2013',
    spike: '+110%',
    definition: 'Belief that women always seek partners of higher status.',
    category: 'Red Pill Theory'
  },
  {
    term: 'MGTOW',
    riskLevel: 'high',
    firstSeen: '2010',
    spike: '+55%',
    definition: 'Men Going Their Own Way - movement of men avoiding relationships with women.',
    category: 'MGTOW'
  },
  {
    term: 'PSL Rating',
    riskLevel: 'medium',
    firstSeen: '2015',
    spike: '+90%',
    definition: 'Numerical rating system (1-10) for physical attractiveness.',
    category: 'Looksmaxxing'
  },
  {
    term: 'Stacy',
    riskLevel: 'medium',
    firstSeen: '2009',
    spike: '+95%',
    definition: 'Stereotypical attractive woman, counterpart to Chad.',
    category: 'Manosphere Archetypes'
  },
  {
    term: 'Simp',
    riskLevel: 'low',
    firstSeen: '2019',
    spike: '+340%',
    definition: 'Man who shows excessive sympathy and attention toward women.',
    category: 'Internet Slang'
  },
  {
    term: 'LMS',
    riskLevel: 'high',
    firstSeen: '2014',
    spike: '+90%',
    definition: 'Looks, Money, Status - belief that only these matter in attraction.',
    category: 'Red Pill Theory'
  },
  {
    term: 'Heightmogging',
    riskLevel: 'medium',
    firstSeen: '2017',
    spike: '+160%',
    definition: 'Being taller than someone else, dominating in height.',
    category: 'Looksmaxxing'
  },
  {
    term: 'Framemogging',
    riskLevel: 'medium',
    firstSeen: '2017',
    spike: '+140%',
    definition: 'Having a more impressive physical build than someone.',
    category: 'Looksmaxxing'
  },
  {
    term: 'Cope',
    riskLevel: 'medium',
    firstSeen: '2015',
    spike: '+125%',
    definition: 'Rationalization or denial of harsh reality (according to blackpill ideology).',
    category: 'Incel Ideology'
  }
];

// Comprehensive term database for intelligent analysis
const termDatabase: Record<string, Term> = {
  // High Risk Terms
  'blackpill': {
    term: 'blackpilled',
    riskLevel: 'high',
    riskScore: 85,
    definition: 'Nihilistic belief that success in dating/relationships is predetermined by genetics and impossible to change.',
    context: 'Core concept of incel ideology. Promotes fatalism and resentment. Often a gateway to more extreme misogynistic views.',
    firstSeen: '2014',
    trendSpike: '+230%',
    relatedTerms: ['redpill', 'incel', 'looksmaxxing', 'hypergamy'],
    platforms: ['Reddit', '4chan', 'TikTok', 'Discord']
  },
  'incel': {
    term: 'incel',
    riskLevel: 'high',
    riskScore: 90,
    definition: 'Involuntary celibate - member of online community characterized by misogyny and resentment toward women.',
    context: 'Associated with extremist ideology and has been linked to real-world violence. Immediate concern.',
    firstSeen: '2008',
    trendSpike: '+45%',
    relatedTerms: ['blackpill', 'femoid', 'chad', 'stacy'],
    platforms: ['4chan', 'Reddit', 'Discord', 'Forums']
  },
  'foid': {
    term: 'foids',
    riskLevel: 'high',
    riskScore: 95,
    definition: 'Derogatory slang for women (short for "female humanoids").',
    context: 'Extremely dehumanizing language used in incel communities. Critical red flag indicating deep exposure to misogynistic ideology.',
    firstSeen: '2012',
    trendSpike: '+75%',
    relatedTerms: ['femoid', 'roastie', 'blackpill'],
    platforms: ['4chan', 'Incel forums', 'Discord']
  },
  'andrew tate': {
    term: 'Andrew Tate',
    riskLevel: 'high',
    riskScore: 88,
    definition: 'Controversial influencer known for promoting toxic masculinity, misogyny, and materialistic values.',
    context: 'Despite bans on major platforms, his content continues to spread. Promotes harmful views about women and relationships. Known for manipulation tactics targeting young men.',
    firstSeen: '2022',
    trendSpike: '+340%',
    relatedTerms: ['top g', 'hustlers university', 'matrix', 'alpha male'],
    platforms: ['TikTok', 'YouTube', 'Instagram', 'Telegram']
  },
  'tate': {
    term: 'Andrew Tate',
    riskLevel: 'high',
    riskScore: 88,
    definition: 'Controversial influencer known for promoting toxic masculinity, misogyny, and materialistic values.',
    context: 'Despite bans on major platforms, his content continues to spread. Promotes harmful views about women and relationships.',
    firstSeen: '2022',
    trendSpike: '+340%',
    relatedTerms: ['top g', 'hustlers university', 'matrix', 'alpha male'],
    platforms: ['TikTok', 'YouTube', 'Instagram', 'Telegram']
  },
  'redpill': {
    term: 'red pill',
    riskLevel: 'high',
    riskScore: 75,
    definition: 'Accepting supposed harsh truths about women, dating, and society. Often involves pickup artist tactics.',
    context: 'Gateway to more extreme ideologies. Promotes manipulative relationship tactics and cynical worldview.',
    firstSeen: '2012',
    trendSpike: '+95%',
    relatedTerms: ['alpha', 'beta', 'hypergamy', 'mgtow'],
    platforms: ['Reddit', 'YouTube', 'Forums']
  },

  // Medium Risk Terms
  'looksmaxxing': {
    term: 'looksmaxxing',
    riskLevel: 'medium',
    riskScore: 50,
    definition: 'Maximizing physical appearance through various methods, from grooming to cosmetic surgery.',
    context: 'Can indicate healthy self-improvement OR unhealthy obsession. Monitor for signs of body dysmorphia.',
    firstSeen: '2014',
    trendSpike: '+310%',
    relatedTerms: ['mewing', 'mogging', 'PSL', 'softmaxxing'],
    platforms: ['TikTok', 'YouTube', 'Reddit', 'Discord']
  },
  'mewing': {
    term: 'mewing',
    riskLevel: 'low',
    riskScore: 25,
    definition: 'Tongue posture technique claimed to improve facial structure.',
    context: 'Generally harmless but can be gateway to obsessive looksmaxxing communities.',
    firstSeen: '2018',
    trendSpike: '+450%',
    relatedTerms: ['looksmaxxing', 'mogging', 'jawline'],
    platforms: ['TikTok', 'YouTube', 'Reddit']
  },
  'alpha': {
    term: 'alpha male',
    riskLevel: 'medium',
    riskScore: 55,
    definition: 'Dominant, successful man who attracts women easily. Based on debunked wolf pack theory.',
    context: 'Promotes hierarchical thinking about human relationships. Often paired with toxic masculinity.',
    firstSeen: '2009',
    trendSpike: '+85%',
    relatedTerms: ['beta', 'sigma', 'redpill', 'chad'],
    platforms: ['YouTube', 'TikTok', 'Instagram']
  },
  'beta': {
    term: 'beta male',
    riskLevel: 'medium',
    riskScore: 50,
    definition: 'Man perceived as weak, submissive, or unsuccessful with women.',
    context: 'Used to shame men who don\'t conform to toxic masculinity standards.',
    firstSeen: '2010',
    trendSpike: '+60%',
    relatedTerms: ['alpha', 'simp', 'cuck'],
    platforms: ['Reddit', 'YouTube', 'TikTok']
  },
  'sigma': {
    term: 'sigma male',
    riskLevel: 'medium',
    riskScore: 45,
    definition: 'Lone wolf archetype - successful but operates outside social hierarchy.',
    context: 'Romanticizes isolation. Can promote antisocial behavior.',
    firstSeen: '2020',
    trendSpike: '+280%',
    relatedTerms: ['alpha', 'beta', 'grindset'],
    platforms: ['TikTok', 'YouTube', 'Instagram']
  },
  'chad': {
    term: 'Chad',
    riskLevel: 'medium',
    riskScore: 50,
    definition: 'Stereotypical attractive, successful man who easily attracts women.',
    context: 'Part of reductionist worldview about dating. Used in both memes and serious incel ideology.',
    firstSeen: '2008',
    trendSpike: '+120%',
    relatedTerms: ['Stacy', 'beta', 'incel', 'blackpill'],
    platforms: ['Reddit', 'TikTok', 'YouTube', '4chan']
  },
  'mgtow': {
    term: 'MGTOW',
    riskLevel: 'high',
    riskScore: 70,
    definition: 'Men Going Their Own Way - movement of men avoiding relationships with women.',
    context: 'Often promotes misogyny under guise of male independence. Can radicalize participants.',
    firstSeen: '2010',
    trendSpike: '+55%',
    relatedTerms: ['redpill', 'monk mode', 'gynocentrism'],
    platforms: ['Reddit', 'YouTube', 'Forums']
  },
  'hypergamy': {
    term: 'hypergamy',
    riskLevel: 'high',
    riskScore: 65,
    definition: 'Belief that women always seek partners of higher status, money, or looks.',
    context: 'Promotes cynical, transactional view of relationships. Core redpill/blackpill concept.',
    firstSeen: '2013',
    trendSpike: '+110%',
    relatedTerms: ['80/20 rule', 'LMS', 'blackpill'],
    platforms: ['Reddit', 'YouTube', 'Forums']
  }
};

// Generate empathetic conversation starters based on detected terms
function generateConversationStarters(detectedTerms: Term[], inputText: string): string[] {
  const starters: string[] = [];
  const highRiskTerms = detectedTerms.filter(t => t.riskLevel === 'high');
  const hasAndrewTate = detectedTerms.some(t => t.term.toLowerCase().includes('tate'));

  if (hasAndrewTate) {
    starters.push(
      "I've noticed you've been interested in Andrew Tate's content. I'm curious - what specific ideas from him resonate with you? Let's talk about what appeals to you about his message.",
      "I want to understand what you're going through. Are you feeling frustrated about something in your life right now? Sometimes these influencers tap into real feelings, but their solutions might not be healthy.",
      "I know Andrew Tate is very popular, and I'm not going to tell you what to watch. But I do want to share some context about him - did you know about the serious allegations against him? Let's look at multiple perspectives together."
    );
  } else if (highRiskTerms.length > 0) {
    starters.push(
      `I came across the term "${highRiskTerms[0].term}" and wanted to learn more about what it means to you. Can you help me understand where you encountered this and what it means in your world?`,
      "I'm noticing some new language that I'm not familiar with. I'm not here to judge - I genuinely want to understand what's on your mind. Can we talk about what you've been learning online?",
      "I care about you and want to make sure you're consuming content that builds you up, not tears you down. What drew you to this particular community or content?"
    );
  }

  // Always add these empathetic approaches
  starters.push(
    "I want you to know that I'm here to listen without judgment. If you're feeling frustrated or confused about relationships, success, or self-worth, those are normal feelings. Let's talk about healthy ways to work through them.",
    "Social media algorithms often show us extreme content because it gets engagement. Are you finding that the content you see is making you feel better or worse about yourself?",
    "I trust you to think critically, and I know you're smart. Let's look at this content together and ask: Who benefits from this message? What are they trying to sell? Is this based on facts or feelings?"
  );

  return starters.slice(0, 4); // Return top 4 most relevant
}

// Analyze any input text and generate realistic results
export function analyzeText(input: string): Translation {
  const inputLower = input.toLowerCase();
  const detectedTerms: Term[] = [];

  // Check against our term database
  Object.keys(termDatabase).forEach(keyword => {
    if (inputLower.includes(keyword.toLowerCase())) {
      const term = termDatabase[keyword];
      // Avoid duplicates
      if (!detectedTerms.find(t => t.term.toLowerCase() === term.term.toLowerCase())) {
        detectedTerms.push(term);
      }
    }
  });

  // If no terms detected, provide general analysis
  if (detectedTerms.length === 0) {
    detectedTerms.push({
      term: 'General Content',
      riskLevel: 'low',
      riskScore: 20,
      definition: 'Text analyzed for concerning patterns and terminology.',
      context: 'No specific manosphere terminology detected. However, continue monitoring for changes in language or behavior.',
      firstSeen: '2024',
      trendSpike: 'N/A',
      relatedTerms: [],
      platforms: ['Various']
    });
  }

  // Sort by risk level (high first)
  detectedTerms.sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });

  const conversationStarters = generateConversationStarters(detectedTerms, input);

  // Generate appropriate resources
  const resources = [];
  const hasHighRisk = detectedTerms.some(t => t.riskLevel === 'high');

  if (hasHighRisk) {
    resources.push({
      title: 'Understanding Online Radicalization: A Parent\'s Guide',
      type: 'urgent_guide',
      url: '/education/online-radicalization'
    });
    resources.push({
      title: 'How to Have Difficult Conversations with Your Teen',
      type: 'parent_guide',
      url: '/education/difficult-conversations'
    });
  }

  resources.push({
    title: 'Healthy Masculinity vs. Toxic Masculinity',
    type: 'guide',
    url: '/education/healthy-masculinity'
  });

  resources.push({
    title: 'Building Critical Thinking About Online Content',
    type: 'guide',
    url: '/education/critical-thinking'
  });

  return {
    id: Date.now(),
    input: input,
    timestamp: new Date().toISOString(),
    terms: detectedTerms,
    conversationStarters,
    resources
  };
}

// Guardian Help Articles - Actionable guidance for parents
export interface GuardianArticle {
  id: number;
  title: string;
  category: 'conversation' | 'warning_signs' | 'understanding' | 'response';
  icon: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  scenario?: string;
}

export const guardianArticles: GuardianArticle[] = [
  {
    id: 1,
    title: "When You Find Andrew Tate Content: A Parent's Response Guide",
    category: 'response',
    icon: '🛡️',
    readTime: '5 min read',
    summary: 'Your child is watching Andrew Tate videos. Here\'s how to respond without pushing them away.',
    keyTakeaways: [
      'Don\'t immediately ban or dismiss - this often backfires',
      'Ask curious questions: "What do you find appealing about his message?"',
      'Share context about his legal troubles and manipulation tactics',
      'Discuss the business model behind influencer content',
      'Offer alternative voices that address similar frustrations'
    ],
    scenario: 'You notice your 15-year-old son watching Andrew Tate compilations on YouTube and using phrases like "escaping the matrix."'
  },
  {
    id: 2,
    title: '10 Warning Signs Your Teen Is Consuming Extreme Content',
    category: 'warning_signs',
    icon: '⚠️',
    readTime: '4 min read',
    summary: 'Early indicators that your child may be exposed to manosphere ideology.',
    keyTakeaways: [
      'Sudden change in language about women or relationships',
      'Increased focus on physical appearance and "status"',
      'Expressing fatalistic views about dating or success',
      'Using niche terminology (blackpill, chad, foids, etc.)',
      'Withdrawing from social activities or female friendships',
      'Consuming content that blames external factors for personal challenges',
      'Expressing admiration for controversial male influencers',
      'Joining online communities focused on male grievances'
    ]
  },
  {
    id: 3,
    title: 'The "Why Does This Appeal to Them?" Framework',
    category: 'understanding',
    icon: '🧠',
    readTime: '6 min read',
    summary: 'Understanding the psychological needs these communities exploit.',
    keyTakeaways: [
      'Young men often feel lost about masculinity in modern society',
      'Manosphere offers simple answers to complex feelings',
      'Provides community and belonging (even if toxic)',
      'Taps into real frustrations about dating, social status, purpose',
      'Understanding the appeal is the first step to offering better alternatives'
    ],
    scenario: 'Instead of asking "Why are you watching this garbage?", try "What specific messages resonate with you? Let\'s talk about what you\'re feeling."'
  },
  {
    id: 4,
    title: 'Conversation Starters That Actually Work',
    category: 'conversation',
    icon: '💬',
    readTime: '7 min read',
    summary: 'Proven approaches for difficult conversations about online content.',
    keyTakeaways: [
      'Start with curiosity, not judgment: "Help me understand..."',
      'Validate real feelings while challenging harmful ideas',
      'Use questions instead of lectures',
      'Find common ground before disagreeing',
      'Focus on values and character, not just content',
      'Example: "I noticed you\'ve been interested in looksmaxxing content. Are you feeling pressure about your appearance? Let\'s talk about that."'
    ]
  },
  {
    id: 5,
    title: 'From Incel Ideology to Healthy Masculinity: A Recovery Path',
    category: 'response',
    icon: '🌱',
    readTime: '8 min read',
    summary: 'Practical steps to guide someone away from extremist thinking.',
    keyTakeaways: [
      'Provide positive male role models (not just criticism)',
      'Address underlying issues: loneliness, social skills, self-esteem',
      'Encourage real-world activities and connections',
      'Professional help: when and how to suggest therapy',
      'Celebrate small wins and progress',
      'Patience: deradicalization takes time and trust'
    ]
  },
  {
    id: 6,
    title: 'What "Blackpilled" Really Means (And Why It Matters)',
    category: 'understanding',
    icon: '📖',
    readTime: '5 min read',
    summary: 'Decoding core incel terminology and the worldview behind it.',
    keyTakeaways: [
      'Blackpill = belief that success in dating/life is genetically predetermined',
      'Promotes fatalism and learned helplessness',
      'Gateway to more extreme misogynistic views',
      'Often masks depression or social anxiety',
      'Counter with growth mindset and real success stories',
      'Professional mental health support may be needed'
    ]
  },
  {
    id: 7,
    title: 'The Looksmaxxing Rabbit Hole: When to Worry',
    category: 'warning_signs',
    icon: '🔍',
    readTime: '4 min read',
    summary: 'Distinguishing healthy self-improvement from obsessive behavior.',
    keyTakeaways: [
      'Healthy: Better grooming, exercise, confidence-building',
      'Unhealthy: Obsessive measuring, body dysmorphia, extreme measures',
      'Watch for: Social withdrawal, excessive mirror-checking, extreme dieting',
      'Red flags: Talk of surgery as teen, comparing to "PSL ratings"',
      'When to seek help: If affecting mental health or daily functioning'
    ]
  },
  {
    id: 8,
    title: 'Building Critical Thinking About Influencers',
    category: 'conversation',
    icon: '🎯',
    readTime: '6 min read',
    summary: 'Teaching your teen to question what they see online.',
    keyTakeaways: [
      'Ask: "Who profits from this message?"',
      'Discuss: Engagement algorithms amplify extreme content',
      'Examine: "Is this based on evidence or feelings?"',
      'Explore: "What might someone with different experience say?"',
      'Practice together: Fact-checking and source evaluation',
      'Goal: Develop healthy skepticism, not paranoia'
    ]
  }
];
