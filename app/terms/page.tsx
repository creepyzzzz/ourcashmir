"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
    {
        title: '1. Services Provided',
        content: `Our Cashmir offers end-to-end social media growth solutions for Kashmiri businesses, including:

• Localized content creation & storytelling that connects with your audience
• Meta/Facebook & Instagram ad campaigns that drive real customers
• Influencer collaborations with local creators
• Content planning, scripting, and video editing (shorts, reels, long-form)
• Thumbnail and graphics design tailored for local engagement
• Weekly analytics and performance reporting

Our approach focuses on organic growth and measurable results, without bots or fake engagement.`
    },
    {
        title: '2. Client Responsibilities',
        content: `Clients should maintain clear and respectful communication and provide timely inputs. Understanding that social media growth takes time is important — while we aim for strong results, they cannot be guaranteed due to platform dynamics.`
    },
    {
        title: '3. Liability and Disclaimers',
        content: `Our Cashmir puts 100% effort into every project. We cannot guarantee specific follower counts or sales, but all growth is organic, authentic, and local-focused.`
    },
    {
        title: '4. Payments and Fees',
        content: `Fees are due as per the agreed schedule. Services begin on contract start date. Monthly payments are required even if services are paused or canceled mid-cycle.`
    },
    {
        title: '5. Governing Law',
        content: `These terms are governed by the laws applicable in our operating jurisdiction.`
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-32 pb-12 max-w-screen-2xl mx-auto">
                <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
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
                            <FileText size={14} />
                            Legal
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Terms & Conditions
                        </h1>

                        <p className="text-gray-400 text-lg">
                            Please read these terms carefully before using our services.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <div className="max-w-3xl">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-8 p-6 rounded-2xl bg-gray-900/40 border border-gray-800/50"
                        >
                            <h2 className="text-xl font-bold text-brand-primary mb-4">{section.title}</h2>
                            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
