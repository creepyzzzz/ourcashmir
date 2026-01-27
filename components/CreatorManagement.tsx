import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Video } from 'lucide-react';
import Image from 'next/image';

const CreatorManagement: React.FC = () => {
    return (
        <section className="w-full px-4 md:px-12 lg:px-20 py-8 md:py-24 max-w-screen-2xl mx-auto bg-black border-t border-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Visuals */}
                <div className="relative order-2 lg:order-1 h-full flex items-center justify-center w-full">
                    <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto mt-6 lg:mt-0">
                        {/* Decorative background elements */}
                        {/* Decorative background elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 md:w-64 md:h-64 bg-brand-primary/20 rounded-full blur-[60px] md:blur-[80px] -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 md:w-64 md:h-64 bg-blue-500/10 rounded-full blur-[60px] md:blur-[80px] -z-10" />

                        {/* Main Card */}
                        <div className="bg-gray-900 border border-gray-800 p-3 rounded-3xl shadow-2xl relative">
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-800">
                                <Image
                                    src="/images/ourcashmir/managed1.webp"
                                    alt="RJ Harleen - Managed Creator"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                {/* Overlay Gradient */}
                                {/* Status Badge - Top Right */}
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full shadow-lg">
                                        <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-[9px] md:text-[10px] font-semibold text-white/90 tracking-widest uppercase">Active Now</span>
                                    </div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent pt-12 md:pt-20">
                                    {/* Categories / Tags */}
                                    <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                                        <span className="inline-flex items-center gap-1 bg-brand-primary text-black text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.3)]">
                                            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                            Managed
                                        </span>
                                        <span className="inline-flex items-center justify-center px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[9px] md:text-[10px] font-medium uppercase tracking-widest">
                                            Top 1% Talent
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-1 flex items-center gap-1.5">
                                        RJ Harleen
                                        <div className="bg-blue-500 rounded-full p-0.5" title="Verified">
                                            <Video className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-current" />
                                        </div>
                                    </h3>
                                    <p className="text-gray-300 text-[10px] md:text-sm font-light tracking-wide border-l-2 border-brand-primary pl-2 md:pl-3">
                                        Radio Jockey & Content Creator
                                    </p>
                                </div>
                            </div>

                            {/* Floating Stats Cards - Desktop */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="absolute -right-12 top-12 bg-gray-800/90 backdrop-blur-md border border-gray-700 p-3 rounded-xl shadow-xl hidden lg:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-primary/20 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Growth</p>
                                        <p className="text-white font-bold text-sm">+210% Reach</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="absolute -left-12 bottom-32 bg-gray-800/90 backdrop-blur-md border border-gray-700 p-3 rounded-xl shadow-xl hidden lg:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Star className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Campaigns</p>
                                        <p className="text-white font-bold text-sm">Brand Deals</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-[10px] md:text-sm mb-2 md:mb-4 block">
                        For Creators
                    </span>
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-6 leading-tight">
                        Build your Personal brand with us, <br className="hidden md:block" />
                        <span className="text-gray-500 block md:inline mt-1 md:mt-0">we will manage you.</span>
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Ready to take the next step? Focus on what you do best—creating content. Let us handle the negotiations, strategy, and production. we turn creators into household names.
                    </p>

                    <div className="flex flex-col gap-6 md:gap-8 items-center lg:items-start">
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                            <div className="flex items-center gap-2 text-white bg-gray-900/50 px-3 py-1.5 rounded-full lg:bg-transparent lg:p-0 border border-gray-800 lg:border-none">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-primary" />
                                <span className="text-xs md:text-base">Professional Management</span>
                            </div>
                            <div className="flex items-center gap-2 text-white bg-gray-900/50 px-3 py-1.5 rounded-full lg:bg-transparent lg:p-0 border border-gray-800 lg:border-none">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-primary" />
                                <span className="text-xs md:text-base">Revenue Optimization</span>
                            </div>
                        </div>

                        <motion.a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSf9sgwNp-Y-NcUGepaU3yEdaDZzMcgyF_5Z66Ajhtz7gfMrPQ/viewform?usp=send_form&pli=1&authuser=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 md:gap-3 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm tracking-widest uppercase w-full sm:w-fit transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            Apply to become a managed creator
                            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreatorManagement;
