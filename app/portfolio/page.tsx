"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const videos = [
    { id: 'cg79s90AZuI', title: 'Brand Campaign 1' },
    { id: 'MtRvDOfJo8c', title: 'Brand Campaign 2' },
    { id: 'ZDu0RJi14d0', title: 'Brand Campaign 3' },
    { id: 'k0debaXwUxs', title: 'Brand Campaign 4' },
    { id: 'j_1DufSoMuE', title: 'Brand Campaign 5' },
    { id: 'GuT7TzmD4Dk', title: 'Brand Campaign 6' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

// Video Card Component to isolate state
import { Loader2 } from 'lucide-react'; // Import Loader icon

function VideoCard({ video, index }: { video: { id: string, title: string }, index: number }) {
    const [isHovering, setIsHovering] = React.useState(false);
    const [videoLoaded, setVideoLoaded] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(true); // Must be muted to autoplay on most browsers

    // Reset states when not hovering
    React.useEffect(() => {
        if (!isHovering) {
            setVideoLoaded(false);
            setIsMuted(true); // Reset to muted
        }
    }, [isHovering]);

    return (
        <motion.div
            variants={itemVariants}
            className="group relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800/50 group-hover:border-brand-primary/30 transition-all duration-300 shadow-xl">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 via-transparent to-brand-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                {/* 1. Background Thumbnail - Always rendered to prevent black flash */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {/* Play/Loading Button Icon */}
                    {/* Show Loading if Hovering & Not Loaded yet */}
                    {/* Show Play if Not Hovering */}
                    {/* Hide if Loaded */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 ${videoLoaded ? 'opacity-0 scale-90' : 'opacity-100 group-hover:scale-110'}`}>
                        {isHovering && !videoLoaded ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <Play className="w-6 h-6 text-white fill-white" />
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-medium truncate">{video.title}</p>
                    </div>
                </div>

                {/* 2. YouTube Iframe - Rendered on hover, Fades in on load */}
                {isHovering && (
                    <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${video.id}&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            onLoad={() => setVideoLoaded(true)}
                            className="w-full h-full object-cover"
                        />

                        {/* Audio Toggle Control */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                            }}
                            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors z-20"
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Video Number Badge */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-black font-bold text-sm shadow-lg z-20">
                {(index + 1).toString().padStart(2, '0')}
            </div>
        </motion.div>
    );
}

export default function PortfolioPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                {/* Background Glow */}
                <div className="absolute top-20 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-brand-primary/5 rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px] pointer-events-none" />
                <div className="absolute top-40 left-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-secondary/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors mb-6 sm:mb-8 text-xs sm:text-sm"
                    >
                        <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block bg-brand-primary/10 border border-brand-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-brand-primary mb-4 sm:mb-6">
                            <Play size={10} className="sm:w-3 sm:h-3 inline mr-1.5 sm:mr-2" />
                            Our Work
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Videos that make<br />
                            your brand spread<br />
                            <span className="text-brand-primary">like wildfire</span>
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Watch some of our best work. These videos have generated millions of views
                            and helped our clients achieve remarkable growth.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Videos Grid */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-24 max-w-screen-2xl mx-auto">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {videos.map((video, index) => (
                        <VideoCard key={index} video={video} index={index} />
                    ))}
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-12 sm:pb-16 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
                    {[
                        { value: '10M+', label: 'Views Generated' },
                        { value: '20M+', label: 'Accounts Reached' },
                        { value: '₹10L+', label: 'Sales Generated' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-center p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/50 to-transparent border border-gray-800/50"
                        >
                            <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-brand-primary mb-1 sm:mb-2">
                                {stat.value}
                            </p>
                            <p className="text-gray-400 text-[9px] sm:text-xs md:text-sm uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary/10 via-brand-surface to-gray-900 border border-brand-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-16 text-center">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                            Ready to create viral content?
                        </h2>
                        <p className="text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
                            Let&apos;s make your brand the next success story. Our team is ready to
                            create scroll-stopping content that converts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <a
                                href="https://wa.me/917889676481"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:bg-green-400 transition-colors"
                            >
                                Get Started Today
                            </a>
                            <a
                                href="mailto:teamourcashmir@gmail.com"
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:border-brand-primary hover:text-brand-primary transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
