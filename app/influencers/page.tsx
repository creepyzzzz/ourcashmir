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
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/4 w-[250px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[400px] md:h-[500px] bg-brand-primary/8 rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px] pointer-events-none" />
                <div className="absolute top-40 right-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-secondary/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors mb-6 sm:mb-8 text-xs sm:text-sm"
                    >
                        <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-primary/10 border border-brand-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-brand-primary mb-4 sm:mb-6">
                            <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                            Our Network
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Influencer <span className="text-brand-primary">Network</span>
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
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

            {/* Managed Creator Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 py-16 md:py-24 max-w-screen-2xl mx-auto border-t border-gray-800">
                <div className="relative rounded-3xl overflow-hidden bg-brand-surface p-8 md:p-16">
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl">
                            <span className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold tracking-wider uppercase text-xs mb-6">
                                For Creators
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Build your Personal brand with us, <br />
                                <span className="text-brand-primary">we will manage you</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                                Join our exclusive roster of managed creators. We provide 360° management,
                                content strategy, and brand deal negotiations to help you focus on creating.
                            </p>

                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSf9sgwNp-Y-NcUGepaU3yEdaDZzMcgyF_5Z66Ajhtz7gfMrPQ/viewform?usp=send_form&pli=1&authuser=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-brand-white text-black px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-brand-primary transition-all hover:scale-105 active:scale-95"
                            >
                                Apply to become a managed creator
                                <TrendingUp size={20} />
                            </a>
                        </div>

                        {/* Visual Element */}
                        <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto md:h-[300px] flex items-center justify-center">
                            <div className="relative w-full h-full border border-gray-800 rounded-2xl bg-black/40 backdrop-blur-sm p-6 flex flex-col justify-center items-center gap-4 group hover:border-brand-primary/30 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-2 group-hover:scale-110 transition-transform">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-white font-bold text-xl text-center">Join the Network</h3>
                                <p className="text-gray-500 text-center text-sm">Access exclusive opportunities and professional management</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand CTA Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-brand-surface via-gray-900 to-brand-surface border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-brand-primary/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-brand-secondary/15 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                            Want to leverage influencer marketing?
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
                            Connect your brand with Kashmir&apos;s most trusted voices.
                            We handle everything from influencer selection to campaign management.
                        </p>
                        <a
                            href="https://wa.me/917889676481"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 sm:gap-3 bg-brand-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:bg-green-400 transition-colors"
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
