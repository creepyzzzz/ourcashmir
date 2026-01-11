"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
    {
        title: '1. Information Collection',
        content: `We collect information relevant to your business, brand, or social media presence in Kashmir. This may include publicly available data, as well as personal details such as phone numbers, emails, and addresses, which are collected strictly for contractual purposes and handled with full confidentiality.`
    },
    {
        title: '2. Use of Client Data',
        content: `All information provided is used solely to deliver our services efficiently and communicate effectively. Access to social media accounts or analytics (Instagram, YouTube, etc.) is requested only when necessary, and remains entirely under the client's control.`
    },
    {
        title: '3. Data Security',
        content: `Client data is securely stored and will never be shared publicly or sold to third parties. We are committed to protecting your privacy and maintaining the highest standards of data security.`
    },
    {
        title: '4. Third-Party Services',
        content: `Our Cashmir rarely uses third-party tools. If external services are required, clients are informed in advance and consent is always obtained before any access or data sharing.`
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 max-w-screen-2xl mx-auto">
                <div className="absolute top-20 left-0 w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] bg-brand-primary/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
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
                            <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                            Legal
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                            Privacy Policy
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                            Your privacy is important to us. Learn how we collect, use, and protect your data.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <div className="max-w-3xl">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-4 sm:mb-6 md:mb-8 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gray-900/40 border border-gray-800/50"
                        >
                            <h2 className="text-lg sm:text-xl font-bold text-brand-primary mb-2 sm:mb-4">{section.title}</h2>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{section.content}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
