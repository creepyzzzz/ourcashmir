'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Dock, DockIcon } from '@/components/ui/Dock';

const footerLinks = {
    explore: [
        { label: 'About Us', href: '/#about' },
        { label: 'Our Portfolio', href: '/portfolio' },
        { label: 'Our Services', href: '/#services' },
        { label: 'Influencer Network', href: '/influencers' },
        { label: 'Affiliate Program', href: '/affiliate' },
    ],
    resources: [
        { label: 'Latest Blog', href: '/blog' },
        { label: 'Help & FAQ', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Our Clients', href: '/clients' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Refund Policy', href: '/refunds' },
        { label: 'Shipping Policy', href: '/shipping' },
    ],
};

const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/ourcashmir', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/ourcashmir', label: 'LinkedIn' },
    { icon: MessageCircle, href: 'https://wa.me/917889676481', label: 'WhatsApp' },
    { icon: Mail, href: 'mailto:info@ourcashmir.com', label: 'Email' },
];

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-black border-t border-white/[0.04] overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-primary/3 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-3">
                                <motion.img
                                    src="/favicon/logo.png"
                                    alt="OurCashmir Logo"
                                    className="h-10 md:h-12 w-auto"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                />
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-xl tracking-tighter text-white">
                                        OUR<span className="text-brand-primary">CASHMIR</span>
                                    </span>
                                    <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Marketing Platform</span>
                                </div>
                            </div>
                        </Link>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm font-outfit">
                            We bridge the gap between Kashmiri heritage and digital excellence,
                            empowering local brands to reach global audiences through innovation.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-4 pt-4">
                            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold font-outfit">Stay Updated</p>
                            <div className="group relative max-w-xs">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-brand-white placeholder:text-gray-600 focus:outline-none focus:border-brand-primary/30 focus:bg-white/[0.05] transition-all duration-500 font-outfit"
                                />
                                <motion.button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-black transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowRight size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
                        {Object.entries(footerLinks).map(([category, links]) => (
                            <div key={category} className="space-y-6">
                                <h4 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-[0.2em] font-outfit flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-brand-primary" />
                                    {category}
                                </h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href}>
                                                <motion.span
                                                    className="text-xs md:text-sm text-gray-500 hover:text-brand-primary transition-colors duration-300 font-outfit inline-block"
                                                    whileHover={{ x: 6 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                >
                                                    {link.label}
                                                </motion.span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/[0.04] bg-white/[0.01]">
                <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 lg:py-10">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

                        {/* Copyright & Disclaimer */}
                        <div className="order-3 md:order-1 space-y-1">
                            <p className="text-[10px] md:text-xs text-gray-600 font-outfit tracking-wide">
                                © {new Date().getFullYear()} OurCashmir. All rights reserved.
                            </p>
                            <p className="text-[9px] md:text-[10px] text-gray-600 font-outfit tracking-wide">
                                Disclaimer: Site Contents designed, developed, maintained and updated by{' '}
                                <a
                                    href="https://epplicon.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-primary hover:text-brand-primary/80 transition-colors duration-300 underline underline-offset-2"
                                >
                                    Epplicon Technologies
                                </a>
                                .
                            </p>
                        </div>

                        {/* Social Dock */}
                        <div className="order-1 md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2">
                            <Dock
                                iconSize={36}
                                iconMagnification={48}
                                iconDistance={100}
                                className="border-white/[0.06] bg-black/40 backdrop-blur-xl"
                            >
                                {socialLinks.map((social) => (
                                    <DockIcon key={social.label}>
                                        <Link
                                            href={social.href}
                                            target={social.href.startsWith('http') ? '_blank' : undefined}
                                            rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            aria-label={social.label}
                                            className="text-gray-400 hover:text-brand-primary transition-colors duration-300"
                                        >
                                            <social.icon size={18} strokeWidth={1.5} />
                                        </Link>
                                    </DockIcon>
                                ))}
                            </Dock>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3 order-2 md:order-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                <span className="text-[10px] md:text-xs text-brand-primary font-medium tracking-wide uppercase font-outfit">
                                    Innovating in Kashmir
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;