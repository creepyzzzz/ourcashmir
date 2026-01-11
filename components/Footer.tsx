import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto pb-6 md:pb-12 pt-6 md:pt-10">
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-32 border-b border-gray-800 pb-8 md:pb-20">

                {/* Left Column */}
                <div className="flex-1 space-y-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/favicon/logo.png"
                            alt="OurCashmir Logo"
                            className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    <div className="space-y-4 max-w-sm">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Subscribe to our weekly newsletter</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="w-full bg-brand-surface border border-gray-700 rounded-full py-4 pl-6 pr-14 text-xs font-bold tracking-wide text-brand-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-black hover:bg-brand-primary/90 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <p className="text-xs text-gray-400">Kashmir&apos;s premier marketing agency for brand growth.</p>
                        <a href="mailto:teamourcashmir@gmail.com" className="flex items-center gap-2 text-xl font-bold text-brand-white hover:text-brand-primary transition-colors">
                            <Mail size={20} />
                            teamourcashmir@gmail.com
                        </a>
                    </div>
                </div>

                {/* Right Links */}
                <div className="flex flex-wrap gap-10 md:gap-20">
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-brand-white uppercase tracking-widest">COMPANY</h4>
                        <ul className="space-y-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <li><Link href="/faq" className="hover:text-brand-white transition-colors">FAQ</Link></li>
                            <li><Link href="/clients" className="hover:text-brand-white transition-colors">OUR CLIENTS</Link></li>
                            <li><Link href="/influencers" className="hover:text-brand-white transition-colors">INFLUENCERS</Link></li>
                            <li><Link href="/affiliate" className="hover:text-brand-white transition-colors">AFFILIATE PROGRAM</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-white transition-colors">CONTACT US</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-white transition-colors">TERMS OF SERVICE</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-white transition-colors">PRIVACY POLICY</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-brand-white uppercase tracking-widest">PRODUCT</h4>
                        <ul className="space-y-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <li><Link href="/#services" className="hover:text-brand-white transition-colors">SERVICES</Link></li>
                            <li><Link href="/portfolio" className="hover:text-brand-white transition-colors">PORTFOLIO</Link></li>
                            <li><Link href="/shipping" className="hover:text-brand-white transition-colors">SHIPPING POLICY</Link></li>
                            <li><Link href="/refunds" className="hover:text-brand-white transition-colors">REFUNDS</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-4">
                <p className="text-xs text-gray-500">© 2025 OurCashmir. All rights reserved</p>
                <p className="text-xs text-gray-500">Growing Brands of Kashmir</p>
            </div>
        </footer>
    );
};

export default Footer;