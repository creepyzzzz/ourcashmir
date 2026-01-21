import React from 'react';
import Link from 'next/link';
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
          Growing <span className="italic text-brand-primary">Brands</span> of Kashmir
        </h1>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
          Most businesses in Kashmir struggle to reach the right people.
          <span className="text-brand-primary font-semibold"> Our Cashmir</span> bridges that gap with Meta ads that target buyers and collaborations that build trust fast.
        </p>

        <div className="flex items-center gap-6 pt-2">
          <Link href="/login">
            <button className="flex items-center gap-2 md:gap-3 bg-brand-primary text-black px-6 py-3 md:px-6 md:py-4 rounded-full text-xs font-bold tracking-widest hover:bg-brand-primary/90 transition-colors">
              GET STARTED
              <div className="border border-black/30 rounded-full p-0.5">
                <ArrowRight size={12} />
              </div>
            </button>
          </Link>

          <Link href="/portfolio">
            <button className="text-xs font-bold tracking-widest text-brand-white hover:opacity-70 border-b border-transparent hover:border-white transition-all uppercase">
              VIEW PORTFOLIO
            </button>
          </Link>
        </div>
      </div>

      {/* Right Content / Image */}
      <div className="flex-1 relative w-full flex justify-center lg:justify-end">
        <div className="relative w-[240px] md:w-[400px] lg:w-[450px] aspect-[4/5] mt-4 lg:mt-0">

          {/* Main Image Mask/Shape */}
          <div className="w-full h-full rounded-t-[160px] rounded-b-[40px] overflow-hidden bg-gray-800">
            <img
              src="/images/ourcashmir/People/heroimage.webp"
              alt="Our Cashmir Marketing"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute top-4 -right-4 md:top-20 md:-left-36 md:right-auto bg-gradient-to-br from-gray-900 via-gray-900 to-brand-secondary/30 p-2 md:p-4 rounded-lg md:rounded-2xl shadow-xl w-[130px] md:w-[220px] backdrop-blur-md border border-brand-primary/20 transform scale-85 md:scale-100 transition-all md:hover:-translate-x-2">
            <div className="flex justify-between items-start mb-1 md:mb-2">
              <img
                src="/favicon/logo.png"
                alt="Logo"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
            </div>
            <div className="space-y-0.5 md:space-y-1 mt-2 md:mt-3">
              <p className="text-[8px] md:text-[10px] font-bold text-brand-primary uppercase tracking-widest">Our Visionary</p>
              <p className="text-sm md:text-xl font-bold text-white">Founder & CEO</p>
              <div className="h-px w-full bg-gray-800 my-1 md:my-2"></div>
              <p className="text-[8px] md:text-[10px] text-gray-400 italic leading-tight">"Helping brands reach their true potential in the valley."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;