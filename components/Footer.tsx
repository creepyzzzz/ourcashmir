'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Dock, DockIcon } from '@/components/ui/Dock';

const footerLinks = {
    company: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
    ],
    services: [
        { label: 'Marketing', href: '/services' },
        { label: 'Influencers', href: '/influencers' },
        { label: 'Development', href: '/development' },
        { label: 'Consulting', href: '/consulting' },
    ],
    legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Cookies', href: '/cookies' },
    ],
};

const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:info@ourcashmir.com', label: 'Email' },
];

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-brand-darker border-t border-white/[0.04]">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-24">

                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        <Link href="/" className="inline-block">
                            <motion.img
                                src="/favicon/logo.png"
                                alt="OurCashmir Logo"
                                className="h-8 md:h-10 w-auto"
                                whileHover={{ opacity: 0.8 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>

                        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xs md:max-w-sm font-outfit">
                            Crafting digital experiences for visionary brands in Kashmir and beyond.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-3">
                            <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-[0.15em] font-outfit">Newsletter</p>
                            <div className="group relative max-w-[280px] md:max-w-xs">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-transparent border-b border-white/10 py-2.5 md:py-3 pr-10 text-sm text-brand-white placeholder:text-gray-600 focus:outline-none focus:border-brand-primary/50 transition-colors duration-500 font-outfit"
                                />
                                <motion.button
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-primary transition-colors duration-300"
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {Object.entries(footerLinks).map(([category, links]) => (
                            <div key={category} className="space-y-4 md:space-y-6">
                                <h4 className="text-[9px] md:text-[10px] font-medium text-gray-600 uppercase tracking-[0.15em] md:tracking-[0.2em] font-outfit">
                                    {category}
                                </h4>
                                <ul className="space-y-2 md:space-y-3">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href}>
                                                <motion.span
                                                    className="text-xs md:text-sm text-gray-500 hover:text-brand-white transition-colors duration-300 font-outfit inline-block"
                                                    whileHover={{ x: 4 }}
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
            <div className="border-t border-white/[0.04]">
                <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-5 md:py-6 lg:py-8">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0 md:h-16 lg:h-20">

                        {/* Copyright */}
                        <div className="order-2 md:order-1 md:absolute md:left-0 z-10">
                            <p className="text-[10px] md:text-xs text-gray-600 font-outfit">
                                © {new Date().getFullYear()} OurCashmir
                            </p>
                        </div>

                        {/* Social Dock */}
                        <div className="order-1 md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2 z-0 w-full md:w-auto flex justify-center">
                            <Dock
                                iconSize={32}
                                iconMagnification={44}
                                iconDistance={80}
                                className="border-white/[0.06] bg-white/[0.02]"
                            >
                                {socialLinks.map((social) => (
                                    <DockIcon key={social.label}>
                                        <Link
                                            href={social.href}
                                            target={social.href.startsWith('http') ? '_blank' : undefined}
                                            rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            aria-label={social.label}
                                            className="text-gray-500 hover:text-brand-primary transition-colors duration-300"
                                        >
                                            <social.icon size={16} strokeWidth={1.5} />
                                        </Link>
                                    </DockIcon>
                                ))}
                            </Dock>
                        </div>

                        {/* Status */}
                        <div className="hidden md:flex items-center gap-2 order-3 md:absolute md:right-0 z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-[10px] md:text-xs text-gray-600 font-outfit">All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;