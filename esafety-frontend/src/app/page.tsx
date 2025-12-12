'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, TrendingUp, BookOpen, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const features = [
    {
      icon: Search,
      title: 'Translator',
      description: 'Decode manosphere language',
      detail: 'Instantly translate concerning online slang and terminology into plain language with risk assessment.',
      href: '/translator',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Intelligence Dashboard',
      description: 'Track trends in real-time',
      detail: 'Monitor emerging narratives, viral content, and recruitment tactics across all major platforms.',
      href: '/dashboard',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn & empower',
      detail: 'Evidence-based guides, conversation starters, and resources for parents and educators.',
      href: '/about',
      gradient: 'from-teal-500 to-green-500',
    },
  ];

  const stats = [
    { label: 'Terms Tracked', value: '450+' },
    { label: 'Weekly Growth', value: '+156%' },
    { label: 'Platforms Monitored', value: '8' },
    { label: 'Risk Alerts', value: '23' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-card mb-8"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">
              Protecting Young People from Online Radicalization
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Decode. Understand.{' '}
            <span className="gradient-text">Connect.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Guardian.Social helps parents and educators understand manosphere
            content and have empathetic, non-judgmental conversations with
            young people exploring these online communities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-6 text-lg shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
              >
                Explore Dashboard
                <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/translator">
              <Button
                size="lg"
                variant="outline"
                className="group glassmorphic-card-hover px-8 py-6 text-lg border-white/20 text-white hover:border-white/40"
              >
                Try Translator
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glassmorphic-card p-6"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Three Pillars Section */}
      <section className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Three Pillars of <span className="gradient-text">Protection</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive tools to monitor, understand, and address online
            radicalization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Link href={feature.href}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="h-full glassmorphic-card-hover p-8 group cursor-pointer"
                  >
                    {/* Icon with gradient background */}
                    <div className="relative w-16 h-16 mb-6">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`}
                      />
                      <div
                        className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      {feature.detail}
                    </p>

                    {/* Arrow Link */}
                    <div className="flex items-center text-cyan-400 font-medium group-hover:gap-2 transition-all">
                      Learn More
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative container mx-auto px-6 py-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center glassmorphic-card p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Protecting Young People Today
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Try our interactive translator to decode concerning online language,
            or explore the intelligence dashboard to see what narratives are
            trending this week.
          </p>
          <Link href="/translator">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-12 py-6 text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              Try Interactive Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer with Team Name */}
      <footer className="relative border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Built with ❤️ by{' '}
            <span className="font-bold gradient-text">#BANDITS</span> for the
            eSafety Commissioner Grand Challenge 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
