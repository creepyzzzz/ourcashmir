import React from 'react';
import { ArrowRight, Sprout } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full px-4 md:px-12 lg:px-20 pt-32 pb-12 md:pb-20 max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-20">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-30 pointer-events-none">
        {/* Abstract curve simulation */}
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Left Content */}
      <div className="flex-1 space-y-8 z-10">
        <div className="inline-block bg-brand-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-black">
          We can help you
        </div>

        <h1 className="text-3xl md:text-6xl lg:text-[76px] leading-[1.1] md:leading-[1.1] font-bold text-brand-white tracking-tight">
          Grow <span className="italic text-brand-primary">faster</span> with our all-in-one marketing platform
        </h1>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
          We aren't your average, run-of-the-mill website designer—
          our services pack a serious punch. We are Digital agency
          for websites that achieve goals.
        </p>

        <div className="flex items-center gap-6 pt-2">
          <button className="flex items-center gap-2 md:gap-3 bg-brand-primary text-black px-6 py-3 md:px-6 md:py-4 rounded-full text-xs font-bold tracking-widest hover:bg-brand-primary/90 transition-colors">
            GET STARTED
            <div className="border border-black/30 rounded-full p-0.5">
              <ArrowRight size={12} />
            </div>
          </button>

          <button className="text-xs font-bold tracking-widest text-brand-white hover:opacity-70 border-b border-transparent hover:border-white transition-all">
            LEARN MORE
          </button>
        </div>
      </div>

      {/* Right Content / Image */}
      <div className="flex-1 relative w-full flex justify-center lg:justify-end">
        <div className="relative w-[240px] md:w-[400px] lg:w-[450px] aspect-[4/5] mt-4 lg:mt-0">

          {/* Main Image Mask/Shape */}
          <div className="w-full h-full rounded-t-[160px] rounded-b-[40px] overflow-hidden bg-gray-800">
            <img
              src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=989&auto=format&fit=crop"
              alt="Happy marketing professional"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute top-6 -left-8 md:top-20 md:-left-24 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-secondary/30 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl w-[160px] md:w-[220px] backdrop-blur-md border border-brand-primary/20 transform scale-90 md:scale-100">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary text-xs font-bold">1</div>
              <div className="bg-white p-1 rounded-lg shadow-sm">
                <Sprout size={24} className="text-brand-primary" />
              </div>
            </div>
            <div className="space-y-1 mt-3">
              <p className="text-xs font-bold text-gray-300">Congrats!</p>
              <p className="text-2xl font-bold text-white">$12.5</p>
              <p className="text-[8px] text-gray-400">16 hours ago</p>
              <p className="text-[8px] text-gray-400 truncate">1x Gymnocalycium mihanovichii ..</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;