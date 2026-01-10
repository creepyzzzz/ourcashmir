"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointer2, Star, Share2, Video, Code, ArrowUpRight } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: React.ElementType;
  colSpan: string;
  bgClass?: string;
  hoverImages: string[];
}

const services: Service[] = [
  {
    title: "Social Media Marketing",
    description: "Build communities and drive real engagement with data-driven strategies.",
    icon: Share2,
    colSpan: "sm:col-span-2 md:col-span-2 md:row-span-2",
    bgClass: "bg-brand-primary text-black",
    hoverImages: [
      "/images/ourcashmir/INFLUENCERS/ZACK.jpg",
      "/images/ourcashmir/INFLUENCERS/VAGABOND.jpg",
      "/images/ourcashmir/INFLUENCERS/AATIF WANI.jpg"
    ]
  },
  {
    title: "Influencer Marketing",
    description: "Collaborate with Kashmir's top creators.",
    icon: MousePointer2,
    colSpan: "md:col-span-1 md:row-span-1",
    hoverImages: [
      "/images/ourcashmir/INFLUENCERS/KASHUR BOI.jpg",
      "/images/ourcashmir/INFLUENCERS/CHEF OWAIS.jpg",
      "/images/ourcashmir/INFLUENCERS/WITH SOHAIL.jpg"
    ]
  },
  {
    title: "SEO & Ads",
    description: "Rank higher and reach more customers.",
    icon: Search,
    colSpan: "md:col-span-1 md:row-span-1",
    hoverImages: [
      "/images/ourcashmir/People/logo-270.png",
      "/images/ourcashmir/People/Web involve.jpeg",
      "/images/ourcashmir/People/EYE CARE.jpg"
    ]
  },
  {
    title: "Content Production",
    description: "High-quality reels, shorts, and creatives.",
    icon: Video,
    colSpan: "md:col-span-1 md:row-span-1",
    hoverImages: [
      "/images/ourcashmir/People/image.png",
      "/images/ourcashmir/People/vishal.png",
      "/images/ourcashmir/People/Ab.png"
    ]
  },
  {
    title: "Web Development",
    description: "Fast, responsive, and SEO-optimized sites.",
    icon: Code,
    colSpan: "md:col-span-1 md:row-span-1",
    hoverImages: [
      "/images/ourcashmir/People/QHH.png",
      "/images/ourcashmir/People/PB.jpg",
      "/images/ourcashmir/People/deconcepts.jpg"
    ]
  },
  {
    title: "Brand Strategy",
    description: "A complete roadmap for success.",
    icon: Star,
    colSpan: "md:col-span-1 md:row-span-1",
    hoverImages: [
      "/images/ourcashmir/People/Lovely sweets.jpg",
      "/images/ourcashmir/People/Power House.png",
      "/images/ourcashmir/People/Circus.jpg"
    ]
  }
];

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${service.bgClass
        ? service.bgClass
        : 'bg-gray-900/40 border border-gray-800 hover:border-white/20'
        } ${service.colSpan}`}
      initial="initial"
      whileHover="hover"
    >
      {/* Hover Images Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none p-6">
        {service.hoverImages.map((img, index) => (
          <motion.div
            key={index}
            className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-2xl border-2 ${service.bgClass ? 'border-white/20' : 'border-white/20'}`}
            style={{
              top: '50%',
              left: '50%',
              zIndex: 10 + index,
            }}
            variants={{
              initial: { opacity: 0, scale: 0.5, rotate: 0, x: "-50%", y: "-50%" },
              hover: {
                opacity: 1,
                scale: 1,
                rotate: index === 0 ? -12 : index === 1 ? 12 : -5,
                x: index === 0 ? "-75%" : index === 1 ? "-25%" : "-50%", // Fanned out horizontally
                y: index === 0 ? "-45%" : index === 1 ? "-55%" : "-30%", // Slight vertical scatter
                transition: {
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }
              }
            }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Content Layer with Backdrop Blur for readability */}
      <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-full ${service.bgClass ? 'bg-black/10' : 'bg-brand-primary/10'}`}>
            <service.icon size={24} className={service.bgClass ? 'text-black' : 'text-brand-primary'} />
          </div>
          <ArrowUpRight
            size={20}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 ${service.bgClass ? 'text-black' : 'text-brand-primary'}`}
          />
        </div>

        <div>
          <h3 className={`text-xl md:text-2xl font-bold mb-2 ${service.bgClass ? 'text-black' : 'text-white'}`}>
            {service.title}
          </h3>
          <p className={`text-sm leading-relaxed ${service.bgClass ? 'text-black/70 font-medium' : 'text-gray-400'}`}>
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto py-16 md:py-24" id="services">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-brand-primary/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase text-brand-primary mb-6">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Build brand recognition as an industry <span className="text-brand-primary">leader</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg">
            We offer a comprehensive suite of digital marketing services designed to scale your business in Kashmir and beyond.
          </p>
        </motion.div>
      </div>

      {/* Perfect 3x3 Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Services;
