'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Globe,
  AlertTriangle,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { weeklyTrends, glossaryTerms } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardPage() {
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = glossaryTerms.filter((term) =>
    term.term.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const platformData = [
    { name: 'TikTok', value: weeklyTrends.platformBreakdown.tiktok.percentage, color: '#06b6d4' },
    { name: 'YouTube', value: weeklyTrends.platformBreakdown.youtube.percentage, color: '#8b5cf6' },
    { name: 'Instagram', value: weeklyTrends.platformBreakdown.instagram.percentage, color: '#10b981' },
    { name: 'Discord', value: weeklyTrends.platformBreakdown.discord.percentage, color: '#f59e0b' },
  ];

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-400/50';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/50';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-400/50';
    }
  };

  const getRiskIndicator = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black" />

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-card mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Intelligence Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            📊 This Week in{' '}
            <span className="gradient-text">Manosphere</span>
          </h1>
          <p className="text-xl text-gray-400">
            {weeklyTrends.week} • Real-time monitoring and threat analysis
          </p>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="glassmorphic-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-400">Growth</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {weeklyTrends.stats.growth}
            </div>
          </div>
          <div className="glassmorphic-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">New Terms</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {weeklyTrends.stats.newTerms}
            </div>
          </div>
          <div className="glassmorphic-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-teal-400" />
              <span className="text-sm text-gray-400">Platforms</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {weeklyTrends.stats.platforms}
            </div>
          </div>
          <div className="glassmorphic-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">High Risk</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {weeklyTrends.stats.highRiskPercentage}%
            </div>
          </div>
        </motion.div>

        {/* Trending Narratives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">🔥 Trending Now</h2>
          <div className="space-y-6">
            {weeklyTrends.topNarratives.map((narrative, index) => (
              <motion.div
                key={narrative.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glassmorphic-card p-8 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-4xl">{narrative.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                        {narrative.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge
                          className={getRiskColor(narrative.riskLevel)}
                        >
                          {narrative.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <span className="text-green-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {narrative.growth}
                        </span>
                        <span className="text-gray-400">
                          Target: {narrative.targetDemographic}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {narrative.description}
                      </p>

                      {/* Platforms */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Platforms:</p>
                        <div className="flex flex-wrap gap-2">
                          {narrative.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-3 py-1 bg-black/30 rounded-full text-sm text-gray-300 border border-white/10"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Examples */}
                      <details className="group/details">
                        <summary className="cursor-pointer text-cyan-400 font-medium flex items-center gap-2 hover:text-cyan-300 transition-colors">
                          View Examples
                          <ChevronRight className="w-4 h-4 group-open/details:rotate-90 transition-transform" />
                        </summary>
                        <div className="mt-4 space-y-2 pl-4 border-l-2 border-cyan-400/30">
                          {narrative.examples.map((example, i) => (
                            <p key={i} className="text-sm text-gray-400 italic">
                              &ldquo;{example}&rdquo;
                            </p>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Chart */}
          <div className="glassmorphic-card p-8">
            <h3 className="text-2xl font-bold mb-6">
              🌐 Where Content Is Spreading
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Stats */}
          <div className="glassmorphic-card p-8">
            <h3 className="text-2xl font-bold mb-6">Platform Breakdown</h3>
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{platform.name}</span>
                    <span className="font-bold" style={{ color: platform.color }}>
                      {platform.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.value}%` }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Decoding Slang Section - Screenshot Ready */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">🔍 Decoding Manosphere Slang</h2>
          <p className="text-gray-400 mb-8">
            Understanding the language is the first step to meaningful conversations
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cope */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="glassmorphic-card p-6 border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Cope</h3>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                  MEDIUM RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    A way of dismissing someone's attempt to feel better about themselves.
                    Used to say someone is in denial about harsh reality.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Promotes nihilistic thinking and dismisses healthy coping mechanisms.
                    Often used to reinforce blackpill ideology.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Becky */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="glassmorphic-card p-6 border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Becky</h3>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                  MEDIUM RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    Stereotype of an average-looking woman, as opposed to "Stacy"
                    (considered highly attractive). Part of looks-based ranking system.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Reduces women to appearance rankings. Promotes objectification
                    and superficial judgments about human worth.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* MGTOW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="glassmorphic-card p-6 border-l-4 border-red-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">MGTOW</h3>
                <Badge className="bg-red-500/10 text-red-400 border-red-400/50">
                  HIGH RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    "Men Going Their Own Way" - A movement of men who claim to avoid
                    romantic relationships with women to focus on themselves.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Often masks misogyny under guise of male independence. Can lead
                    to isolation and radicalization into more extreme views.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Looksmaxxing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="glassmorphic-card p-6 border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Looksmaxxing</h3>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                  MEDIUM RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    Trying to maximize physical attractiveness through grooming,
                    exercise, or even cosmetic procedures.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Can indicate healthy self-improvement OR dangerous obsession.
                    Watch for body dysmorphia, extreme measures, or social withdrawal.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Alpha Male */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="glassmorphic-card p-6 border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Alpha Male</h3>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                  MEDIUM RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    The idea of a dominant, successful man who leads and attracts women
                    easily. Based on debunked wolf pack theory.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Promotes rigid, hierarchical view of masculinity. Can pressure
                    boys to conform to toxic behaviors to prove their worth.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Black Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="glassmorphic-card p-6 border-l-4 border-red-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Black Pill</h3>
                <Badge className="bg-red-500/10 text-red-400 border-red-400/50">
                  HIGH RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    The belief that dating success is completely determined by genetics
                    and looks, and that trying to improve yourself is pointless.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Core incel ideology. Promotes extreme fatalism and resentment.
                    Gateway to misogyny and can indicate depression or social anxiety.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Chad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="glassmorphic-card p-6 border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Chad</h3>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                  MEDIUM RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    Stereotype of a conventionally attractive, successful man who
                    easily attracts women. Seen as genetically superior.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Part of a worldview that reduces relationships to genetics and
                    looks. Can foster resentment and feelings of inadequacy.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Simp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="glassmorphic-card p-6 border-l-4 border-green-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-cyan-400">Simp</h3>
                <Badge className="bg-green-500/10 text-green-400 border-green-400/50">
                  LOW RISK
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">What it means:</p>
                  <p className="text-gray-200">
                    Someone (usually a man) who shows excessive attention or kindness
                    to someone they're attracted to, hoping for romantic interest.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Why it matters:</p>
                  <p className="text-gray-200">
                    Often used to shame boys for showing kindness or respect. Can
                    discourage healthy emotional expression and empathy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Glossary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="glassmorphic-card p-8"
        >
          <h2 className="text-3xl font-bold mb-6">📚 Full Glossary</h2>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search terms..."
              className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Glossary Table */}
          <div className="space-y-3">
            {filteredGlossary.slice(0, 10).map((term, index) => (
              <motion.div
                key={term.term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.05 }}
                className="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-cyan-400/30 transition-colors group cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{getRiskIndicator(term.riskLevel)}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">
                        {term.term}
                      </h4>
                      <p className="text-sm text-gray-400">{term.definition}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          First seen: {term.firstSeen}
                        </span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {term.spike}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {term.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGlossary.length > 10 && (
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Showing 10 of {filteredGlossary.length} terms
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
