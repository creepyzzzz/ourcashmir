import React from 'react';
import { motion } from 'framer-motion';

const Stats: React.FC = () => {
  const stats = [
    { value: '10L+', label: 'Sales Generated' },
    { value: '10M+', label: 'Views Generated' },
    { value: '20M+', label: 'Accounts Reached' },
  ];

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-16 md:mb-32 relative z-10 overflow-hidden">
      <div className="flex justify-between items-end relative py-8">
        {/* The Main Horizontal Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
        />

        {stats.map((stat, index) => (
          <div key={index} className="relative flex flex-col items-center flex-1">
            {/* The Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + (index * 0.2) }}
              className="mb-6 md:mb-8 text-center"
            >
              <h3 className="text-xl sm:text-4xl md:text-5xl lg:text-7xl font-oswald font-medium text-brand-white tracking-tight flex items-baseline justify-center">
                <span>{stat.value.replace(/(\D+)/g, '')}</span>
                <span className="text-brand-primary text-[10px] sm:text-lg md:text-3xl lg:text-4xl ml-0.5 md:ml-1 align-top">
                  {stat.value.replace(/(\d+)/g, '')}
                </span>
              </h3>
              <p className="text-[7px] sm:text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-[0.1em] md:tracking-[0.3em] mt-1 md:mt-2 px-1">
                {stat.label}
              </p>
            </motion.div>

            {/* The Vertical Tick Mark */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
              className="absolute bottom-0 w-px bg-brand-primary/50 md:h-8"
              style={{ height: 'inherit' }}
            />

            {/* The Glowing Dot */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1.6 + (index * 0.1) }}
              className="absolute bottom-0 translate-y-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_2px_rgba(0,255,0,0.3)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;