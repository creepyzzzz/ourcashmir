import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-16 md:mb-24 flex flex-col items-center">
      <div className="inline-block bg-brand-primary px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-black mb-8 md:mb-12">
        Our Testimonials
      </div>

      <div className="w-full relative flex items-center justify-center gap-6 overflow-hidden py-4">

        {/* Left Partial Card */}
        <div className="hidden md:block w-1/4 h-64 bg-gray-800 border border-gray-700 rounded-3xl opacity-40 shrink-0 transform -translate-x-12 scale-90 p-8">
          <p className="font-bold text-brand-white">a marketing experience...</p>
        </div>

        {/* Center Active Card */}
        <div className="w-full md:w-[600px] bg-brand-surface rounded-2xl md:rounded-[30px] p-5 md:p-12 relative shrink-0 border border-brand-primary/20">
          <p className="text-base md:text-2xl font-medium text-brand-white leading-relaxed mb-6 md:mb-10">
            This is my first time working with a marketing company and I had a fantastic experience. Business is doing better than ever and I am very grateful for OurCashmir. Highly recommend!
          </p>

          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-base font-bold text-brand-white">Pavel Solomin</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Founder Net ABC</p>
            </div>

            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ArrowLeft size={16} className="text-brand-white" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ArrowRight size={16} className="text-brand-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Partial Card */}
        <div className="hidden md:block w-1/4 h-64 bg-gray-800 border border-gray-700 rounded-3xl opacity-40 shrink-0 transform translate-x-12 scale-90 p-8">
          <p className="font-medium text-brand-white">This is my first time...</p>
          <div className="mt-8">
            <h4 className="font-bold text-brand-white">Pavel Solomin</h4>
            <p className="text-xs text-gray-400">Founder Net ABC</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;