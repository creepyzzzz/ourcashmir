import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-16 md:mb-24">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-10 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-white leading-tight max-w-md">
          We are team with enthusiasm for communication
        </h2>

        <div className="max-w-xs space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed">
            Your business has a story to tell—we'll help you tell it. Our team features a roster of industry experts and highly-skilled creatives because we won't settle for less.
          </p>

          <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-white group">
            VIEW MORE
            <span className="bg-transparent border border-gray-500 rounded-full p-1 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all">
              <ArrowRight size={12} />
            </span>
          </button>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        <div className="w-full h-[240px] md:h-[350px] rounded-2xl md:rounded-[30px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Team working together"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="w-full h-[240px] md:h-[350px] rounded-2xl md:rounded-[30px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
            alt="Creative meeting"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-colors group">
          <ArrowLeft size={16} className="text-brand-white group-hover:text-black" />
        </button>
        <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-colors group">
          <ArrowRight size={16} className="text-brand-white group-hover:text-black" />
        </button>
      </div>

    </section>
  );
};

export default Team;