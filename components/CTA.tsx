import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-12 md:mb-20">
      <div className="w-full bg-brand-surface rounded-2xl md:rounded-[40px] p-6 md:p-16 lg:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[250px] md:min-h-[400px]">

        {/* Left Content */}
        <div className="relative z-10 max-w-md space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-white leading-tight">
            Let's discuss your project
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
            The essential to combine empathy, creativity and rationality to meet user needs and business success
          </p>
          <Link href="/login">
            <button className="flex items-center gap-3 bg-brand-primary text-black px-6 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-brand-primary/90 transition-colors mt-4">
              GET STARTED
              <div className="border border-black/30 rounded-full p-0.5">
                <ArrowRight size={14} />
              </div>
            </button>
          </Link>
        </div>

        {/* Right Abstract Art */}
        <div className="absolute right-[-10%] md:right-0 top-1/2 transform -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] pointer-events-none opacity-80 text-brand-primary">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            {/* Concentric Circles / Arcs */}
            <circle cx="350" cy="250" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="350" cy="250" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="350" cy="250" r="220" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M150,250 Q250,100 350,250 T550,250" fill="none" stroke="currentColor" strokeWidth="1" />

            {/* Yellow Accents */}
            <circle cx="200" cy="250" r="25" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <circle cx="350" cy="110" r="25" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <circle cx="450" cy="200" r="25" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <circle cx="410" cy="350" r="25" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <circle cx="260" cy="360" r="25" fill="currentColor" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

      </div>
    </section>
  );
};

export default CTA;