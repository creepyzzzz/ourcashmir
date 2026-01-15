import React from 'react';
import { ArrowRight, Star, TrendingUp, Video } from 'lucide-react';

const CreatorManagement: React.FC = () => {
    return (
        <section className="w-full px-4 md:px-12 lg:px-20 py-20 max-w-screen-2xl mx-auto bg-black border-t border-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Visuals */}
                <div className="relative order-2 lg:order-1">
                    <div className="relative z-10 grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
                                <TrendingUp className="text-brand-primary mb-4" size={32} />
                                <h3 className="text-white font-bold text-lg">Growth Strategy</h3>
                                <p className="text-gray-400 text-sm mt-2">Data-driven content planning to maximize reach.</p>
                            </div>
                            <div className="bg-brand-primary p-6 rounded-2xl border border-brand-primary text-black">
                                <h3 className="font-bold text-lg">Brand Deals</h3>
                                <p className="text-black/80 text-sm mt-2">Exclusive partnerships with top tier brands.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
                                <Video className="text-brand-white mb-4" size={32} />
                                <h3 className="text-white font-bold text-lg">Production</h3>
                                <p className="text-gray-400 text-sm mt-2">Professional editing and shoot management.</p>
                            </div>
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
                                <Star className="text-brand-primary mb-4" size={32} />
                                <h3 className="text-white font-bold text-lg">Personal Brand</h3>
                                <p className="text-gray-400 text-sm mt-2">Identity building and reputation management.</p>
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/10 blur-[100px] pointer-events-none -z-10" />
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2">
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                        For Creators
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Build your Personal brand with us, <br />
                        <span className="text-gray-500">we will manage you.</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Focus on what you do best—creating content. Let us handle the negotiations, strategy, and production. We turn creators into household names.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            <span>Professional Management</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            <span>Revenue Optimization</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreatorManagement;
