"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const clients = [
    { name: 'Gatoes', logo: '/images/ourcashmir/People/image.png', instagram: 'https://www.instagram.com/gatoes.official/' },
    { name: 'Just Zing', logo: '/images/ourcashmir/People/logo-270.png', instagram: 'https://www.instagram.com/justzingofficial/' },
    { name: 'Eye Care Centre', logo: '/images/ourcashmir/People/EYE CARE.jpg', instagram: 'https://www.instagram.com/eyecarecentrekupwara' },
    { name: 'Khushwara Kahave', logo: '/images/ourcashmir/People/ww.jpg', instagram: 'https://www.instagram.com/khushwara_kahave/' },
    { name: 'IM95 Perfumes', logo: '/images/ourcashmir/People/Ab.png', instagram: 'https://www.instagram.com/__im1995__/' },
    { name: 'Vintage House', logo: '/images/ourcashmir/People/vishal.png', instagram: 'https://www.instagram.com/vintagehousekupwara/' },
    { name: 'Web Involve', logo: '/images/ourcashmir/People/Web involve.jpeg', instagram: 'https://www.instagram.com/webinvolve/' },
    { name: 'Quality Healthcare Hospital', logo: '/images/ourcashmir/People/QHH.png', instagram: 'https://www.instagram.com/p/DKhTsMJTin-/' },
    { name: 'Lovely Sweets', logo: '/images/ourcashmir/People/Lovely sweets.jpg', instagram: 'https://www.instagram.com/p/DLt6msTR-gc/' },
    { name: 'Power House', logo: '/images/ourcashmir/People/Power House.png', instagram: 'https://www.instagram.com/p/DL7Z0RVoJam/' },
    { name: 'Circus', logo: '/images/ourcashmir/People/Circus.jpg', instagram: 'https://www.instagram.com/reel/DMF6AAQyL3h/' },
    { name: 'Bachpan School', logo: '/images/ourcashmir/People/BSK.jpg', instagram: 'https://www.instagram.com/p/DLt35-PzcE_/' },
    { name: 'DeConcepts SGR', logo: '/images/ourcashmir/People/deconcepts.jpg', instagram: 'https://www.instagram.com/reel/DPRXWvDiYaH/' },
    { name: 'Print Box', logo: '/images/ourcashmir/People/PB.jpg', instagram: 'https://www.instagram.com/p/DMXufP-PqMG/' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ClientsPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-32 pb-16 max-w-screen-2xl mx-auto">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

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
                        <span className="inline-block bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-brand-primary mb-6">
                            Trusted Partners
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Our <span className="text-brand-primary">Clients</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            We&apos;ve had the privilege of working with amazing brands across Kashmir.
                            Here are some of the businesses we&apos;ve helped grow.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Clients Grid */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {clients.map((client, index) => (
                        <motion.a
                            key={index}
                            href={client.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-brand-primary/50 hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Logo Container */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white/5 border border-gray-700/50 mb-4 group-hover:border-brand-primary/30 transition-colors">
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-white font-semibold text-sm md:text-base mb-2 group-hover:text-brand-primary transition-colors">
                                    {client.name}
                                </h3>

                                {/* View Link */}
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs group-hover:text-brand-primary transition-colors">
                                    <span>View Profile</span>
                                    <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-brand-surface to-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Want to be our next success story?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Join the growing list of Kashmiri brands that trust us with their digital growth.
                        </p>
                        <a
                            href="https://wa.me/917889676481"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-brand-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-green-400 transition-colors"
                        >
                            Book a Free Call
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
