import React from 'react';
import { ArrowRight, Star, Search, MousePointer2, Share2 } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    { icon: <Search className="w-4 h-4 md:w-5 md:h-5" />, label: "SEO\nStrategy" },
    { icon: <MousePointer2 className="w-4 h-4 md:w-5 md:h-5" />, label: "Influencer\nMarketing" },
    { icon: <Star className="w-4 h-4 md:w-5 md:h-5" />, label: "Marketing\nStrategy" },
    { icon: <Share2 className="w-4 h-4 md:w-5 md:h-5" />, label: "Social Media\nMarketing" },
  ];

  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-16 md:mb-24">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-start">

        {/* Left Text Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-block bg-brand-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-black">
            Our Service
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-brand-white leading-tight max-w-lg">
            We offer the best services for our customer
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Find effective digital reach of your business, powered by humans behaviour and driven by data
          </p>

          <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-white group pt-2">
            LEARN MORE
            <span className="bg-transparent border border-gray-500 rounded-full p-1 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all">
              <ArrowRight size={14} />
            </span>
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full">
          <div className="relative w-full h-[220px] md:h-[400px] rounded-2xl md:rounded-[40px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
              alt="Team meeting"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mt-10 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-start gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-primary flex items-center justify-center text-black">
              {service.icon}
            </div>
            <p className="text-sm md:text-lg font-bold text-brand-white whitespace-pre-line leading-tight">
              {service.label}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Services;