import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto pb-6 md:pb-12 pt-6 md:pt-10">
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-32 border-b border-gray-800 pb-8 md:pb-20">

                {/* Left Column */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="text-brand-primary text-2xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-brand-white">OurCashmir</span>
                    </div>

                    <div className="space-y-4 max-w-sm">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Subscribe to our weekly newsletter</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="w-full bg-brand-surface border border-gray-700 rounded-full py-4 pl-6 pr-14 text-xs font-bold tracking-wide text-brand-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-black hover:bg-green-400 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <p className="text-[10px] text-gray-400">Best sales management tool to boost your business.</p>
                        <a href="mailto:hello@ourcashmir.com" className="flex items-center gap-2 text-xl font-bold text-brand-white hover:text-brand-primary transition-colors">
                            <Mail size={20} />
                            hello@ourcashmir.com
                        </a>
                    </div>
                </div>

                {/* Right Links */}
                <div className="flex flex-wrap gap-10 md:gap-20">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-brand-white uppercase tracking-widest">COMPANY</h4>
                        <ul className="space-y-4 text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <li><a href="#" className="hover:text-brand-white">ABOUT</a></li>
                            <li><a href="#" className="hover:text-brand-white">CAREERS</a></li>
                            <li><a href="#" className="hover:text-brand-white">WE'RE HIRING</a></li>
                            <li><a href="#" className="hover:text-brand-white">PRESS</a></li>
                            <li><a href="#" className="hover:text-brand-white">TERMS OF SERVICE</a></li>
                            <li><a href="#" className="hover:text-brand-white">PRIVACY POLICY</a></li>
                            <li><a href="#" className="hover:text-brand-white">COOKIE POLICY</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-brand-white uppercase tracking-widest">PRODUCT</h4>
                        <ul className="space-y-4 text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <li><a href="#" className="hover:text-brand-white">SERVICES</a></li>
                            <li><a href="#" className="hover:text-brand-white">PRICING</a></li>
                            <li><a href="#" className="hover:text-brand-white">FEATURES</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-4">
                <p className="text-[10px] text-gray-500">© 2026 OurCashmir, Inc. All rights reserved</p>
                <p className="text-[10px] text-gray-500">Design by Slabdsgn</p>
            </div>
        </footer>
    );
};

export default Footer;