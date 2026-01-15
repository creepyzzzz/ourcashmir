"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Gift, Award, BookOpen, Trophy, DollarSign, Users, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
    { step: '01', title: 'Find Brands', description: 'Search local and online brands on Instagram, Facebook, and local contacts.', icon: Users },
    { step: '02', title: 'Make Contact', description: 'DM professionally, introduce OC, and open a conversation.', icon: MessageCircle },
    { step: '03', title: 'Submit & Get Paid', description: 'Collect details, submit to OC, and receive your commission.', icon: DollarSign },
];

const perks = [
    { icon: Gift, title: 'Official Scout ID', description: 'Receive an OC Scout ID card to represent the brand while pitching locally.' },
    { icon: Award, title: 'OC T-shirt', description: 'Claim a limited edition T-shirt after your first approved lead.' },
    { icon: BookOpen, title: 'Training & Certificates', description: 'Access marketing training and get certificates to boost your profile.' },
    { icon: Trophy, title: 'Monthly Rewards', description: 'Top performers receive cash rewards, recognition, and special perks.' },
];

const earnings = [
    { brand: '₹10,000', you: '₹2,000' },
    { brand: '₹50,000', you: '₹10,000' },
    { brand: 'Unlimited', you: 'Unlimited' },
];

export default function AffiliatePage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-brand-primary/10 rounded-full blur-[100px] sm:blur-[140px] md:blur-[180px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] bg-brand-secondary/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />

                <div className="relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors mb-6 sm:mb-8 text-xs sm:text-sm"
                    >
                        <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                        Back to Home
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-primary/10 border border-brand-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-brand-primary mb-4 sm:mb-6">
                                <Rocket size={12} className="sm:w-3.5 sm:h-3.5" />
                                Become a Scout • Earn Real Money
                            </span>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                Build Modern Kashmir — Earn as an{' '}
                                <span className="text-brand-primary">OC Affiliate Scout</span>
                            </h1>

                            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                                Join Our Cashmir&apos;s affiliate program. Find brands, pitch OC&apos;s services,
                                submit leads, and get paid — while learning real marketing & building your network.
                            </p>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                                <a
                                    href="https://chat.whatsapp.com/JwIhHXGlSYBI3Vu4fV9fU9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:bg-green-400 transition-colors"
                                >
                                    💬 Join WhatsApp Group
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent border border-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:border-brand-primary transition-colors"
                                >
                                    See How It Works
                                </a>
                            </div>
                        </motion.div>

                        {/* Right Card - Earnings */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-900 via-gray-900/90 to-brand-surface/40 border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 mt-8 lg:mt-0"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div>
                                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Potential Earnings</p>
                                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary">Unlimited</p>
                                    <p className="text-gray-500 text-[10px] sm:text-sm">Earn per successful lead</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Scout Level</p>
                                    <p className="text-white text-sm sm:text-base font-semibold">Starter • Pro • Elite</p>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4 sm:my-6" />

                            <div className="space-y-2 sm:space-y-3">
                                {earnings.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-black/40 border border-gray-800/50">
                                        <div>
                                            <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">If brand pays</p>
                                            <p className="text-gray-300 text-sm sm:text-base">{item.brand}</p>
                                        </div>
                                        <p className="text-lg sm:text-2xl font-bold text-brand-primary">{item.you}</p>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="https://chat.whatsapp.com/JwIhHXGlSYBI3Vu4fV9fU9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full mt-4 sm:mt-6 bg-brand-primary text-black text-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm hover:bg-green-400 transition-colors"
                            >
                                Become a Scout
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="w-full px-4 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 max-w-screen-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">How It Works</h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">Simple three-step process to start earning</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/60 to-transparent border border-gray-800/50 hover:border-brand-primary/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                                    <step.icon size={20} className="sm:w-6 sm:h-6 text-brand-primary" />
                                </div>
                                <span className="text-brand-primary font-bold text-base sm:text-lg">{step.step}</span>
                            </div>
                            <h3 className="text-white font-bold text-lg sm:text-xl mb-1.5 sm:mb-2">{step.title}</h3>
                            <p className="text-gray-400 text-sm sm:text-base">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Perks & Pitch */}
            <section className="w-full px-4 md:px-12 lg:px-20 py-16 max-w-screen-2xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Perks */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900/80 to-brand-surface/20 border border-gray-800 rounded-3xl p-6 md:p-8"
                    >
                        <h3 className="text-2xl font-bold text-brand-primary mb-6">What You&apos;ll Get</h3>
                        <div className="space-y-4">
                            {perks.map((perk, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                                        <perk.icon size={20} className="text-brand-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">{perk.title}</h4>
                                        <p className="text-gray-400 text-sm">{perk.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Pitch Template */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900/80 to-brand-surface/20 border border-gray-800 rounded-3xl p-6 md:p-8"
                    >
                        <h3 className="text-2xl font-bold text-brand-primary mb-4">Winning Pitch</h3>
                        <p className="text-gray-400 text-sm mb-4">Use this short script when DMing brands:</p>

                        <div className="p-4 rounded-xl bg-black/40 border border-brand-primary/20 mb-6">
                            <p className="text-brand-primary font-medium italic">
                                &ldquo;Hi, I&apos;m a scout from Our Cashmir. We help brands grow using influencer marketing,
                                ads, and creative content. Can I share how we can help your brand scale online?&rdquo;
                            </p>
                        </div>

                        <h4 className="text-white font-semibold mb-3">Three Ways to Find Brands</h4>
                        <ul className="space-y-2">
                            {[
                                'Search Instagram & Facebook: local shops, cafes, service providers.',
                                'Present value: emphasize growth, content, and ad expertise.',
                                'Collect clear details: budget, goals, decision maker contact.',
                            ].map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-400 text-sm">
                                    <CheckCircle size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary/10 via-brand-surface to-brand-primary/10 border border-brand-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
                    <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] bg-brand-primary/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Ready to start?</h2>
                            <p className="text-gray-400 text-sm sm:text-base">Join OC Affiliate Scouts and help build Modern Kashmir while earning real money.</p>
                        </div>
                        <div className="flex gap-3 sm:gap-4 shrink-0">
                            <a
                                href="https://chat.whatsapp.com/JwIhHXGlSYBI3Vu4fV9fU9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-brand-primary text-black px-5 sm:px-6 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm hover:bg-green-400 transition-colors whitespace-nowrap"
                            >
                                💬 Join WhatsApp Group
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
