'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/translator', label: 'Translator' },
    { href: '/about', label: 'About' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphic-card border-b"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <motion.div
                className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Guardian.Social
              </h1>
              <p className="text-xs text-gray-400">Empowering Conversations</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-2 text-sm font-medium transition-colors hover:text-cyan-400"
                >
                  <span
                    className={
                      isActive ? 'text-cyan-400' : 'text-gray-300'
                    }
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Link href="/translator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
            >
              Try Demo
            </motion.button>
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300 hover:text-cyan-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
