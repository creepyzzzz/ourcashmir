"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const clients = [
    { name: 'Gatoes', image: '/images/ourcashmir/People/image.webp', link: 'https://www.instagram.com/gatoes.official/' },
    { name: 'Just Zing', image: '/images/ourcashmir/People/logo-270.webp', link: 'https://www.instagram.com/justzingofficial/' },
    { name: 'Eye Care Centre', image: '/images/ourcashmir/People/EYE CARE.webp', link: 'https://www.instagram.com/reel/DRrmz4niYuB/' },
    { name: 'Khushwara Kahave', image: '/images/ourcashmir/People/ww.webp', link: 'https://www.instagram.com/khushwara_kahave/' },
    { name: 'IM95 Perfumes', image: '/images/ourcashmir/People/Ab.webp', link: 'https://www.instagram.com/__im1995__/' },
    { name: 'Vintage House', image: '/images/ourcashmir/People/vishal.webp', link: 'https://www.instagram.com/vintagehousekupwara/' },
    { name: 'Web Involve', image: '/images/ourcashmir/People/Web involve.webp', link: 'https://www.instagram.com/webinvolve/' },
    { name: 'Quality Healthcare Hospital', image: '/images/ourcashmir/People/QHH.webp', link: 'https://www.instagram.com/p/DKhTsMJTin-/' },
];

export default function ClientsPreview() {
    return (
        <section className="w-full py-12 md:py-16 bg-black border-t border-gray-900 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-12 lg:px-20 mb-8 md:mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <span className="text-brand-primary font-semibold tracking-wider uppercase text-xs md:text-sm mb-3 block">
                            Trusted Partners
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                            Our <span className="text-brand-primary">Clients</span>
                        </h2>
                    </div>

                    <Link
                        href="/clients"
                        className="group inline-flex items-center gap-2 text-white/80 hover:text-brand-primary transition-colors pb-1 border-b border-transparent hover:border-brand-primary text-sm"
                    >
                        View All Clients
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden py-4">
                {/* Gradient Masks */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black z-10" />

                <motion.div
                    className="flex gap-8 md:gap-12 w-max items-center"
                    animate={{ x: "-50%" }}
                    initial={{ x: "0%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 35,
                    }}
                >
                    {/* Duplicate the array multiple times to ensure seamless looping and fill width */}
                    {[...clients, ...clients, ...clients].map((client, index) => (
                        <a
                            key={index}
                            href={client.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-row items-center gap-3 shrink-0 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            {/* Logo Container - Circular */}
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-brand-primary/50 transition-colors">
                                <img
                                    src={client.image}
                                    alt={client.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h3 className="text-white/90 font-medium text-xs md:text-sm whitespace-nowrap">
                                {client.name}
                            </h3>
                        </a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
