'use client';

import { motion } from 'framer-motion';
import { Shield, Brain, Database, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description:
        'Advanced natural language processing to detect and analyze manosphere terminology and recruitment tactics.',
    },
    {
      icon: Database,
      title: 'Comprehensive Database',
      description:
        'Over 450 tracked terms with historical context, risk assessment, and real-world examples.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Monitoring',
      description:
        'Continuous tracking across TikTok, YouTube, Instagram, Discord, and other platforms.',
    },
    {
      icon: Shield,
      title: 'Evidence-Based Guidance',
      description:
        'Resources and conversation starters backed by research on online radicalization.',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black" />

      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-card mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">About the Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How <span className="gradient-text">Guardian.Social</span>{' '}
              Works
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Guardian.Social combines AI technology with empathetic guidance to
              help parents and educators decode concerning online content and
              foster meaningful, non-judgmental conversations with young people.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphic-card p-8"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glassmorphic-card p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The manosphere, a loose network of online communities promoting
              toxic masculinity, misogyny, and anti-feminist views, has become
              increasingly sophisticated in recruiting and radicalizing young
              men. From &ldquo;looksmaxxing&rdquo; content on TikTok to incel
              ideology on Discord, these narratives are spreading at an
              alarming rate.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Guardian.Social was built to bridge the knowledge gap with
              empathy. We provide parents, educators, and community leaders with
              the tools to decode concerning content, understand the appeal of
              these ideologies, and have productive conversations, not
              confrontations, with young people.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Created by <span className="font-bold gradient-text">#BANDITS</span> for
              the eSafety Commissioner Grand Challenge, Guardian.Social demonstrates
              how AI and empathetic design can work together to protect young
              people while preserving trust and open dialogue.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
