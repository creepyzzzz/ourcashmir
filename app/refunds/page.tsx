"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
    {
        title: '1. Cancellation',
        content: `Once services begin on the contract date, clients are obligated to pay for the full month, even if they choose to cancel mid-month. To stop services without additional charges, clients must notify us before the start of the upcoming month.`
    },
    {
        title: '2. Refunds',
        content: `Refunds are not available once work has commenced. For cancellations effective the next month, no further charges will apply after the end of the current billing cycle.`
    },
];

export default function RefundsPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-32 pb-12 max-w-screen-2xl mx-auto">
                <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

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
                            <RotateCcw size={14} />
                            Legal
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Cancellation & Refunds
                        </h1>

                        <p className="text-gray-400 text-lg">
                            Our policies regarding service cancellation and refund requests.
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
                            <p className="text-gray-300 leading-relaxed">{section.content}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
