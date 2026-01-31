'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-brand-darker border border-white/5 overflow-hidden p-6 sm:p-8 md:p-12 lg:p-20">

        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Radial Gradient Glow */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-brand-primary/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 sm:gap-10 lg:gap-16">

          {/* Left Content */}
          <div className="max-w-2xl space-y-5 sm:space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/5 text-[10px] sm:text-xs font-medium text-brand-primary font-outfit uppercase tracking-wider sm:tracking-widest"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-primary animate-pulse" />
              Open for collaborations
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] font-outfit"
            >
              <span className="text-gray-500">Let's discuss</span>
              <br />
              your project.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-400 font-light max-w-md lg:max-w-lg font-outfit leading-relaxed"
            >
              Whether you need a complete brand overhaul or a targeted campaign, we&apos;re ready to help.
            </motion.p>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
            <Link href="/contact" className="w-full sm:w-auto">
              <motion.button
                className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-full bg-brand-primary text-brand-darker text-sm sm:text-base font-bold tracking-wide font-outfit transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,200,83,0.3)] hover:brightness-110"
                whileTap={{ scale: 0.98 }}
              >
                <span>Start a Project</span>
                <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.button>
            </Link>

            <Link href="/schedule" className="w-full sm:w-auto">
              <motion.button
                className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-full bg-white/5 border border-white/10 text-white text-sm sm:text-base font-medium tracking-wide font-outfit backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                whileTap={{ scale: 0.98 }}
              >
                <span>Schedule a Call</span>
                <Calendar size={16} className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:scale-110" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;