const resources = {
  incel: {
    title: 'Incel Ideology Resources',
    description: 'Information and support for concerns about incel content',
    helplines: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7',
        description: 'Free and confidential support'
      }
    ],
    resources: [
      {
        name: 'Exit USA',
        url: 'https://www.lifeafterhate.org/',
        description: 'Helping people leave extremist groups'
      },
      {
        name: 'Masculinity & Mental Health',
        url: 'https://www.apa.org/topics/men-masculinity',
        description: 'APA resources on healthy masculinity'
      },
      {
        name: 'The REAL Movement',
        url: 'https://therealmovement.com/',
        description: 'Healthy relationships and masculinity'
      }
    ],
    actions: [
      'Avoid engaging directly with this content',
      'Consider talking to a trusted friend or counselor',
      'Report concerning content to platform moderators',
      'Seek positive communities focused on personal growth'
    ]
  },

  mgtow: {
    title: 'MGTOW Content Resources',
    description: 'Support for concerns about Men Going Their Own Way ideology',
    helplines: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7'
      }
    ],
    resources: [
      {
        name: 'Healthy Relationships Coalition',
        url: 'https://www.cdc.gov/violenceprevention/intimatepartnerviolence/',
        description: 'CDC resources on healthy relationships'
      },
      {
        name: 'Exit USA',
        url: 'https://www.lifeafterhate.org/',
        description: 'Support for leaving extremist ideologies'
      }
    ],
    actions: [
      'Be cautious about engaging with this content',
      'Seek balanced perspectives on gender and relationships',
      'Report hateful content to platform moderators',
      'Consider professional support if this content is affecting you'
    ]
  },

  pua: {
    title: 'Pick-Up Artist Content Resources',
    description: 'Information about manipulative dating tactics',
    resources: [
      {
        name: 'Consent Education',
        url: 'https://www.rainn.org/articles/what-is-consent',
        description: 'Understanding healthy consent and boundaries'
      },
      {
        name: 'Healthy Relationships',
        url: 'https://www.loveisrespect.org/',
        description: 'Resources for respectful relationships'
      }
    ],
    actions: [
      'Recognize manipulation tactics',
      'Focus on authentic connection and mutual respect',
      'Avoid content promoting deception in relationships',
      'Report harmful content promoting manipulation'
    ]
  },

  grooming: {
    title: 'Child Safety Resources - URGENT',
    description: 'If this involves a child, take immediate action',
    emergencyContact: {
      name: 'National Center for Missing & Exploited Children',
      phone: '1-800-843-5678',
      online: 'CyberTipline.org',
      available: '24/7'
    },
    helplines: [
      {
        name: 'Childhelp National Child Abuse Hotline',
        phone: '1-800-422-4453',
        available: '24/7',
        description: 'Professional crisis counselors'
      },
      {
        name: 'RAINN (Sexual Assault Hotline)',
        phone: '1-800-656-4673',
        available: '24/7',
        website: 'https://www.rainn.org/'
      }
    ],
    resources: [
      {
        name: 'Stop It Now',
        url: 'https://www.stopitnow.org/',
        description: 'Preventing child sexual abuse'
      },
      {
        name: 'NetSmartz',
        url: 'https://www.missingkids.org/netsmartz',
        description: 'Internet safety education'
      }
    ],
    actions: [
      '🚨 URGENT: Contact local law enforcement if a child is in danger',
      'Report to the National Center for Missing & Exploited Children',
      'Document evidence without engaging',
      'Report to the platform immediately',
      'Contact school or child protective services if you know the child'
    ]
  },

  extremist: {
    title: 'Extremist Content Resources',
    description: 'Resources for reporting and understanding extremism',
    reportingChannels: [
      {
        name: 'FBI Tips',
        phone: '1-800-CALL-FBI',
        online: 'tips.fbi.gov',
        description: 'Report threats or extremist activity'
      },
      {
        name: 'DHS Tip Line',
        phone: '1-855-484-7867',
        description: 'Report potential terrorist activity'
      }
    ],
    resources: [
      {
        name: 'Life After Hate',
        url: 'https://www.lifeafterhate.org/',
        description: 'Helping people leave extremist movements'
      },
      {
        name: 'Parents for Peace',
        url: 'https://www.parentsforpeace.org/',
        description: 'Support for families affected by extremism'
      },
      {
        name: 'Free Radicals Project',
        url: 'https://www.freeradicals.org/',
        description: 'Preventing violent extremism'
      }
    ],
    actions: [
      'Report to platform moderators immediately',
      'Do not engage with extremist content',
      'Consider reporting to law enforcement if threats are present',
      'Document evidence safely',
      'Seek support if you or someone you know is being radicalized'
    ]
  },

  concerning: {
    title: 'Potentially Concerning Content',
    description: 'General resources for concerning online content',
    helplines: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7'
      },
      {
        name: 'Crisis Text Line',
        text: 'Text HOME to 741741',
        available: '24/7'
      }
    ],
    resources: [
      {
        name: 'Common Sense Media',
        url: 'https://www.commonsensemedia.org/',
        description: 'Understanding online safety'
      },
      {
        name: 'National Safety Council',
        url: 'https://www.nsc.org/',
        description: 'Safety resources and education'
      }
    ],
    actions: [
      'Trust your instincts about concerning content',
      'Report to platform moderators',
      'Talk to someone you trust',
      'Take breaks from concerning content',
      'Consider professional support if needed'
    ]
  },

  safe: {
    title: 'Content Appears Safe',
    description: 'No significant threats detected',
    resources: [
      {
        name: 'Digital Wellness',
        url: 'https://www.commonsensemedia.org/articles/digital-citizenship',
        description: 'Maintaining healthy online habits'
      }
    ],
    actions: [
      'Continue practicing good digital citizenship',
      'Stay aware of online safety',
      'Report anything concerning you encounter'
    ]
  },

  general: {
    title: 'General Safety Resources',
    description: 'Universal resources for online safety',
    helplines: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7'
      },
      {
        name: 'Crisis Text Line',
        text: 'Text HOME to 741741',
        available: '24/7'
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        available: '24/7',
        description: 'Mental health and substance abuse'
      }
    ],
    onlineResources: [
      {
        name: 'StopBullying.gov',
        url: 'https://www.stopbullying.gov/',
        description: 'Government resource on bullying prevention'
      },
      {
        name: 'ConnectSafely',
        url: 'https://www.connectsafely.org/',
        description: 'Online safety tips and resources'
      },
      {
        name: 'National Center for Missing & Exploited Children',
        url: 'https://www.missingkids.org/',
        description: 'Child safety resources'
      }
    ]
  }
};

module.exports = resources;
