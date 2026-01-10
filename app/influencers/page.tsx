"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Eye, ArrowLeft, Instagram } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const influencers = [
    { name: 'Sufiyan Wani', image: '/images/ourcashmir/INFLUENCERS/ZACK.jpg', instagram: 'https://instagram.com/sufiyanwani', followers: '11.8K', reach: '1M / month', engagement: '12.8%' },
    { name: 'Kashmiri Vagabond', image: '/images/ourcashmir/INFLUENCERS/VAGABOND.jpg', instagram: 'https://instagram.com/kashmiri_vagabond', followers: '21K', reach: '3M / month', engagement: '8.3%' },
    { name: 'Aatif Wani', image: '/images/ourcashmir/INFLUENCERS/AATIF WANI.jpg', instagram: 'https://instagram.com/aatif_wani21', followers: '5.2K', reach: '8M / month', engagement: '6.5%' },
    { name: 'Kashur Boi', image: '/images/ourcashmir/INFLUENCERS/KASHUR BOI.jpg', instagram: 'https://instagram.com/kashurboi00', followers: '25K', reach: '8.2M / month', engagement: '7.1%' },
    { name: 'Chef Owais Malick', image: '/images/ourcashmir/INFLUENCERS/CHEF OWAIS.jpg', instagram: 'https://instagram.com/chefowaixmalick', followers: '6K', reach: '4.5M / month', engagement: '9.2%' },
    { name: 'Khalid Wali', image: '/images/ourcashmir/INFLUENCERS/WITH SOHAIL.jpg', instagram: 'https://instagram.com/withsohail8', followers: '182K', reach: '8M / month', engagement: '8.6%' },
    { name: 'Muraad Ah. Peer', image: '/images/ourcashmir/INFLUENCERS/MURAAD.jpeg', instagram: 'https://instagram.com/maxx_murad_13', followers: '4.3K', reach: '2M / month', engagement: '3.6%' },
    { name: 'Zeeshan Wani', image: '/images/ourcashmir/INFLUENCERS/ZEESHAN.jpeg', instagram: 'https://instagram.com/zeeshannwanii', followers: '1.4K', reach: '3M / month', engagement: '5.6%' },
    { name: 'Musaib Yousuf', image: '/images/ourcashmir/INFLUENCERS/MUSAIB VLOGGING.jpeg', instagram: 'https://instagram.com/its_musaibs_vlogging', followers: '18.1K', reach: '5M / month', engagement: '10.6%' },
    { name: 'Aiyat Nidha', image: '/images/ourcashmir/INFLUENCERS/AIYAT NIDHA.jpeg', instagram: 'https://instagram.com/aiyat_nidha', followers: '3K', reach: '1M / month', engagement: '3.2%' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

export default function InfluencersPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-32 pb-16 max-w-screen-2xl mx-auto">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors mb-8 text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-brand-primary mb-6">
                            <Users size={14} />
                            Our Network
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Influencer <span className="text-brand-primary">Network</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            We collaborate with Kashmir&apos;s top content creators to bring authentic reach
                            and engagement to your brand.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-12 max-w-screen-2xl mx-auto">
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {[
                        { icon: Users, value: '50+', label: 'Influencers' },
                        { icon: Eye, value: '50M+', label: 'Combined Reach' },
                        { icon: TrendingUp, value: '8%', label: 'Avg. Engagement' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-3 px-6 py-3 rounded-full bg-gray-900/50 border border-gray-800"
                        >
                            <stat.icon size={18} className="text-brand-primary" />
                            <span className="text-white font-bold">{stat.value}</span>
                            <span className="text-gray-400 text-sm">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Influencers Grid */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {influencers.map((influencer, index) => (
                        <motion.a
                            key={index}
                            href={influencer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group relative bg-gradient-to-br from-gray-900 via-gray-900/80 to-brand-surface/30 border border-gray-800/60 rounded-2xl overflow-hidden transition-all duration-500 hover:border-brand-primary/40 hover:shadow-2xl hover:-translate-y-2"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Image */}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={influencer.image}
                                    alt={influencer.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Instagram size={16} className="text-brand-primary" />
                                    <h3 className="text-white font-bold text-lg group-hover:text-brand-primary transition-colors">
                                        {influencer.name}
                                    </h3>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-2 rounded-lg bg-black/40 backdrop-blur-sm">
                                        <p className="text-brand-primary font-bold text-sm">{influencer.followers}</p>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Followers</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-black/40 backdrop-blur-sm">
                                        <p className="text-brand-primary font-bold text-sm">{influencer.reach.split(' ')[0]}</p>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Reach</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-black/40 backdrop-blur-sm">
                                        <p className="text-brand-primary font-bold text-sm">{influencer.engagement}</p>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Engage</p>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-brand-surface via-gray-900 to-brand-surface border border-gray-800 rounded-3xl p-8 md:p-12">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-primary/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-brand-secondary/15 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Want to leverage influencer marketing?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Connect your brand with Kashmir&apos;s most trusted voices.
                            We handle everything from influencer selection to campaign management.
                        </p>
                        <a
                            href="https://wa.me/917889676481"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-brand-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-green-400 transition-colors"
                        >
                            Start Your Campaign
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
