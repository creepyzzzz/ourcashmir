"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const videos = [
    { id: 'cg79s90AZuI', title: 'Brand Campaign 1' },
    { id: 'MtRvDOfJo8c', title: 'Brand Campaign 2' },
    { id: 'ZDu0RJi14d0', title: 'Brand Campaign 3' },
    { id: 'k0debaXwUxs', title: 'Brand Campaign 4' },
    { id: 'j_1DufSoMuE', title: 'Brand Campaign 5' },
    { id: 'GuT7TzmD4Dk', title: 'Brand Campaign 6' },
];

function VideoCard({ video, index }: { video: { id: string, title: string }, index: number }) {
    const [isHovering, setIsHovering] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!isHovering) {
            setVideoLoaded(false);
            setIsMuted(true);
        }
    }, [isHovering]);

    return (
        <div
            className="group relative flex-shrink-0 w-[240px] md:w-[320px] mx-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800/50 group-hover:border-brand-primary/30 transition-all duration-300 shadow-xl group-hover:scale-[1.02] group-hover:shadow-brand-primary/10">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 ${videoLoaded ? 'opacity-0 scale-90' : 'opacity-100 group-hover:scale-110'}`}>
                        {isHovering && !videoLoaded ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                            <Play className="w-5 h-5 text-white fill-white" />
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-medium truncate">{video.title}</p>
                    </div>
                </div>

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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                            }}
                            className="absolute bottom-4 right-4 p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors z-20"
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PortfolioPreview() {
    // Triple the array for seamless scrolling
    const duplicatedVideos = [...videos, ...videos, ...videos];

    return (
        <section className="w-full py-16 md:py-24 bg-black border-t border-gray-900 overflow-hidden">
            <div className="px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
                            Our Work
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Featured <span className="text-brand-primary">Campaigns</span>
                        </h2>
                    </div>

                    <Link
                        href="/portfolio"
                        className="group inline-flex items-center gap-2 text-white hover:text-brand-primary transition-colors pb-1 border-b border-transparent hover:border-brand-primary"
                    >
                        View Full Portfolio
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Scrolling Carousel Container */}
            <div className="relative w-full group">
                <style jsx>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.333%); }
                    }
                    .animate-scroll {
                        animation: scroll 30s linear infinite;
                    }
                    .group:hover .animate-scroll {
                        animation-play-state: paused;
                    }
                `}</style>

                {/* 3D Perspective Wrappers - Using CSS Animation for persistent position */}
                <div className="flex" style={{ perspective: '1000px' }}>
                    <div className="flex whitespace-nowrap animate-scroll">
                        {duplicatedVideos.map((video, index) => (
                            <VideoCard key={`${video.id}-${index}`} video={video} index={index} />
                        ))}
                    </div>
                </div>

                {/* Left & Right Gradient Overlays */}
                <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
