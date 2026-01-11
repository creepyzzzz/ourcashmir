"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Instagram } from 'lucide-react';
import Link from 'next/link';

const influencers = [
    { name: 'Sufiyan Wani', image: '/images/ourcashmir/INFLUENCERS/ZACK.jpg', instagram: 'https://instagram.com/sufiyanwani', followers: '11.8K' },
    { name: 'Kashmiri Vagabond', image: '/images/ourcashmir/INFLUENCERS/VAGABOND.jpg', instagram: 'https://instagram.com/kashmiri_vagabond', followers: '21K' },
    { name: 'Aatif Wani', image: '/images/ourcashmir/INFLUENCERS/AATIF WANI.jpg', instagram: 'https://instagram.com/aatif_wani21', followers: '5.2K' },
    { name: 'Kashur Boi', image: '/images/ourcashmir/INFLUENCERS/KASHUR BOI.jpg', instagram: 'https://instagram.com/kashurboi00', followers: '25K' },
];

export default function InfluencerPreview() {
    return (
        <section className="w-full px-4 md:px-12 lg:px-20 py-16 md:py-24 max-w-screen-2xl mx-auto bg-black">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
                        Our Network
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Top <span className="text-brand-primary">Influencers</span>
                    </h2>
                </div>

                <Link
                    href="/influencers"
                    className="group inline-flex items-center gap-2 text-white hover:text-brand-primary transition-colors pb-1 border-b border-transparent hover:border-brand-primary"
                >
                    View All Influencers
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {influencers.map((influencer, index) => (
                    <motion.a
                        key={index}
                        href={influencer.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900"
                    >
                        <img
                            src={influencer.image}
                            alt={influencer.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-brand-primary transition-colors">
                                {influencer.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Instagram size={14} />
                                <span>{influencer.followers}</span>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
