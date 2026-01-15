"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@ourcashmir.com', href: 'mailto:info@ourcashmir.com' },
    { icon: Phone, label: 'Phone', value: '+91 788-967-6481', href: 'tel:+917889676481' },
    { icon: MapPin, label: 'Address', value: 'Kupwara, Jammu & Kashmir, India', href: null },
    { icon: Clock, label: 'Working Hours', value: 'Mon-Sat: 9AM-6PM (24/7 Online)', href: null },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                {/* Background Glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/8 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-3xl mx-auto">
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
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-primary/10 border border-brand-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-brand-primary mb-4 sm:mb-6">
                            <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                            Get in Touch
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                            Contact <span className="text-brand-primary">Us</span>
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                            We value every opportunity to connect with our clients.
                            Reach out through any of the following channels.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {contactInfo.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:border-brand-primary/40 transition-all duration-300"
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                                <item.icon size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px] text-brand-primary" />
                            </div>
                            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">{item.label}</p>
                            {item.href ? (
                                <a
                                    href={item.href}
                                    className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-brand-primary transition-colors break-all"
                                >
                                    {item.value}
                                </a>
                            ) : (
                                <p className="text-white font-semibold text-xs sm:text-sm md:text-base">{item.value}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main CTA Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden bg-gradient-to-br from-brand-surface via-gray-900 to-brand-surface border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-primary/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-secondary/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                            <MessageCircle size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9 text-brand-primary" />
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                            Let&apos;s Start a Conversation
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
                            Whether you&apos;re looking to grow your brand, have questions about our services,
                            or want to discuss a potential collaboration — we&apos;re here to help.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <a
                                href="https://wa.me/917889676481"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-primary text-black px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:bg-green-400 transition-colors"
                            >
                                <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                                Chat on WhatsApp
                            </a>
                            <a
                                href="mailto:info@ourcashmir.com"
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent border border-gray-600 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:border-brand-primary hover:text-brand-primary transition-colors"
                            >
                                <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                                Send Email
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
