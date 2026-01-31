'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 max-w-screen-2xl mx-auto py-32 md:py-40">
      <div className="relative flex flex-col items-center text-center">

        {/* Animated gradient line */}
        <motion.div
          className="absolute top-0 left-1/2 w-px h-20 bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent"
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0, x: '-50%', y: -80 }}
        />

        {/* Main Heading with staggered reveal */}
        <div className="overflow-hidden">
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-brand-white leading-[0.95] tracking-tight font-outfit"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s talk
          </motion.h2>
        </div>

        <div className="overflow-hidden mt-2">
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight font-outfit"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="text-gray-600">about </span>
            <span className="text-brand-primary">your project</span>
          </motion.h2>
        </div>

        {/* Subtext */}
        <motion.p
          className="mt-8 text-gray-500 text-base md:text-lg max-w-md leading-relaxed font-outfit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          We&apos;d love to hear from you. Let&apos;s create something extraordinary together.
        </motion.p>

        {/* CTA Button with magnetic effect */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/contact">
            <motion.button
              className="group relative flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden font-outfit"
              whileHover={{
                borderColor: 'rgba(0, 200, 83, 0.3)',
                backgroundColor: 'rgba(0, 200, 83, 0.05)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative z-10 text-sm font-medium text-gray-400 group-hover:text-brand-white transition-colors duration-300">
                Start a conversation
              </span>
              <motion.span
                className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-brand-darker"
                whileHover={{ rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ArrowUpRight size={14} />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row items-center gap-8 text-sm text-gray-600 font-outfit"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.a
            href="mailto:info@ourcashmir.com"
            className="hover:text-brand-primary transition-colors duration-300"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            info@ourcashmir.com
          </motion.a>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-gray-700">Kashmir, India</span>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;