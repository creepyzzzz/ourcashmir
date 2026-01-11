"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const clients = [
    { name: 'Gatoes', image: '/images/ourcashmir/People/image.png', link: 'https://www.instagram.com/gatoes.official/' },
    { name: 'Just Zing', image: '/images/ourcashmir/People/logo-270.png', link: 'https://www.instagram.com/justzingofficial/' },
    { name: 'Eye Care Centre', image: '/images/ourcashmir/People/EYE CARE.jpg', link: 'https://www.instagram.com/reel/DRrmz4niYuB/' },
    { name: 'Khushwara Kahave', image: '/images/ourcashmir/People/ww.jpg', link: 'https://www.instagram.com/khushwara_kahave/' },
    { name: 'IM95 Perfumes', image: '/images/ourcashmir/People/Ab.png', link: 'https://www.instagram.com/__im1995__/' },
    { name: 'Vintage House', image: '/images/ourcashmir/People/vishal.png', link: 'https://www.instagram.com/vintagehousekupwara/' },
    { name: 'Web Involve', image: '/images/ourcashmir/People/Web involve.jpeg', link: 'https://www.instagram.com/webinvolve/' },
    { name: 'Quality Healthcare Hospital', image: '/images/ourcashmir/People/QHH.png', link: 'https://www.instagram.com/p/DKhTsMJTin-/' },
];

export default function ClientsPreview() {
    return (
        <section className="w-full px-4 md:px-12 lg:px-20 py-16 md:py-24 max-w-screen-2xl mx-auto bg-black border-t border-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
                        Trusted Partners
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Our <span className="text-brand-primary">Clients</span>
                    </h2>
                </div>

                <Link
                    href="/clients"
                    className="group inline-flex items-center gap-2 text-white hover:text-brand-primary transition-colors pb-1 border-b border-transparent hover:border-brand-primary"
                >
                    View All Clients
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {clients.map((client, index) => (
                    <motion.a
                        key={index}
                        href={client.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-brand-primary/50 flex flex-col items-center justify-center text-center h-40 md:h-48"
                    >
                        {/* Logo Container */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white/5 mb-3 flex items-center justify-center p-2">
                            <img
                                src={client.image}
                                alt={client.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h3 className="text-white font-semibold text-sm group-hover:text-brand-primary transition-colors line-clamp-1">
                            {client.name}
                        </h3>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
