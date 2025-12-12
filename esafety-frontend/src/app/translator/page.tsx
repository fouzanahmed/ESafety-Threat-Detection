'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Copy,
  Sparkles,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { quickExamples, translations, Translation, analyzeText } from '@/lib/mockData';

export default function TranslatorPage() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Translation | null>(null);

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis with 2 second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Use intelligent text analyzer for ANY input
    const analyzedResult = analyzeText(input);

    setResult(analyzedResult);
    setIsAnalyzing(false);
  };

  const handleExampleClick = (text: string) => {
    setInput(text);
    setResult(null);
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'text-red-400 border-red-400/50 bg-red-500/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10';
      case 'low':
        return 'text-green-400 border-green-400/50 bg-green-500/10';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-card mb-6">
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Manosphere Translator</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Decode <span className="gradient-text">Concerning Language</span>{' '}
            Instantly
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Paste text or a screenshot to understand the hidden meanings, risk
            levels, and context behind manosphere terminology.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="glassmorphic-card p-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Input Text
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste concerning text here... (e.g., 'Just got blackpilled, going monk mode')"
              className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-gray-500 resize-none"
            />

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleTranslate}
                disabled={!input.trim() || isAnalyzing}
                size="lg"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/20"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Translate & Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Examples */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <p className="text-sm text-gray-400 mb-4">
              📚 Quick Examples (Click to load):
            </p>
            <div className="flex flex-wrap gap-3">
              {quickExamples.map((example) => (
                <Button
                  key={example.label}
                  variant="outline"
                  onClick={() => handleExampleClick(example.text)}
                  className="glassmorphic-card-hover border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50"
                >
                  {example.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto glassmorphic-card p-8"
            >
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="h-20 bg-white/5 rounded-lg"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* Results Header */}
              <div className="glassmorphic-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Translation Results</h2>
                </div>
                <p className="text-gray-400">
                  Found {result.terms.length} concerning term
                  {result.terms.length > 1 ? 's' : ''} in the input text
                </p>
              </div>

              {/* Term Cards */}
              {result.terms.map((term, index) => (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="glassmorphic-card p-8"
                >
                  {/* Term Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(term.riskLevel)}
                      <div>
                        <h3 className="text-2xl font-bold">&ldquo;{term.term}&rdquo;</h3>
                        <Badge
                          className={`mt-2 ${getRiskColor(term.riskLevel)}`}
                        >
                          {term.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text">
                        {term.riskScore}
                      </div>
                      <div className="text-xs text-gray-400">Risk Score</div>
                    </div>
                  </div>

                  {/* Definition */}
                  <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      Definition:
                    </p>
                    <p className="text-gray-200">{term.definition}</p>
                  </div>

                  {/* Context */}
                  <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      Context:
                    </p>
                    <p className="text-gray-200">{term.context}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">First Seen</p>
                      <p className="font-bold text-cyan-400">{term.firstSeen}</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Trend Spike</p>
                      <p className="font-bold text-purple-400 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {term.trendSpike}
                      </p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Platforms</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {term.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="text-xs px-2 py-1 bg-white/5 rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Related Terms */}
                  {term.relatedTerms.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">
                        Related Terms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((related) => (
                          <span
                            key={related}
                            className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Conversation Starters */}
              {result.conversationStarters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.terms.length * 0.15 + 0.2 }}
                  className="glassmorphic-card p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold">
                      💬 Conversation Starters for Parents
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {result.conversationStarters.map((starter, index) => (
                      <div
                        key={index}
                        className="p-4 bg-black/30 rounded-lg border border-white/5 group hover:border-cyan-400/30 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-gray-200 leading-relaxed">
                            &ldquo;{starter}&rdquo;
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(starter)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Resources */}
              {result.resources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.terms.length * 0.15 + 0.4 }}
                  className="glassmorphic-card p-8"
                >
                  <h3 className="text-xl font-bold mb-4">📚 Learn More</h3>
                  <div className="space-y-3">
                    {result.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        className="block p-4 bg-black/30 rounded-lg border border-white/5 hover:border-cyan-400/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-200 group-hover:text-cyan-400 transition-colors">
                            {resource.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Analyze Another Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    setResult(null);
                    setInput('');
                  }}
                  variant="outline"
                  size="lg"
                  className="glassmorphic-card-hover border-white/20 text-white hover:border-cyan-400/50 hover:text-cyan-400"
                >
                  🔄 Analyze Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
