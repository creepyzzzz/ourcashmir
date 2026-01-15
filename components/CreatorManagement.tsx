import React from 'react';
import { ArrowRight, Star, TrendingUp, Video } from 'lucide-react';

const CreatorManagement: React.FC = () => {
    return (
        <section className="w-full px-4 md:px-12 lg:px-20 py-10 md:py-20 max-w-screen-2xl mx-auto bg-black border-t border-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Visuals */}
                <div className="relative order-2 lg:order-1">
                    <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
                            <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-800 backdrop-blur-sm">
                                <TrendingUp className="text-brand-primary mb-3 md:mb-4 w-6 h-6 md:w-8 md:h-8" />
                                <h3 className="text-white font-bold text-base md:text-lg">Growth Strategy</h3>
                                <p className="text-gray-400 text-xs md:text-sm mt-1.5 md:mt-2">Data-driven content planning to maximize reach.</p>
                            </div>
                            <div className="bg-brand-primary p-4 md:p-6 rounded-xl md:rounded-2xl border border-brand-primary text-black">
                                <h3 className="font-bold text-base md:text-lg">Brand Deals</h3>
                                <p className="text-black/80 text-xs md:text-sm mt-1.5 md:mt-2">Exclusive partnerships with top tier brands.</p>
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <div className="bg-gray-800/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-700 backdrop-blur-sm">
                                <Video className="text-brand-white mb-3 md:mb-4 w-6 h-6 md:w-8 md:h-8" />
                                <h3 className="text-white font-bold text-base md:text-lg">Production</h3>
                                <p className="text-gray-400 text-xs md:text-sm mt-1.5 md:mt-2">Professional editing and shoot management.</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-800 backdrop-blur-sm">
                                <Star className="text-brand-primary mb-3 md:mb-4 w-6 h-6 md:w-8 md:h-8" />
                                <h3 className="text-white font-bold text-base md:text-lg">Personal Brand</h3>
                                <p className="text-gray-400 text-xs md:text-sm mt-1.5 md:mt-2">Identity building and reputation management.</p>
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/10 blur-[100px] pointer-events-none -z-10" />
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2">
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-xs md:text-sm mb-3 md:mb-4 block">
                        For Creators
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                        Build your Personal brand with us, <br className="hidden md:block" />
                        <span className="text-gray-500">we will manage you.</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
                        Focus on what you do best—creating content. Let us handle the negotiations, strategy, and production. We turn creators into household names.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-primary" />
                            <span className="text-sm md:text-base">Professional Management</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-primary" />
                            <span className="text-sm md:text-base">Revenue Optimization</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreatorManagement;
