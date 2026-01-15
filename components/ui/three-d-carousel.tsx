"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectItem } from "@/types";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface ThreeDCarouselProps {
    items: ProjectItem[];
    autoPlayInterval?: number;
    hideDescription?: boolean;
}

export const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
    items,
    autoPlayInterval = 2000,
    hideDescription = false
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const savedCallback = React.useRef(handleNext);

    // Keep callback fresh
    useEffect(() => {
        savedCallback.current = handleNext;
    });

    // Auto-play logic
    useEffect(() => {
        // Continue auto-play even on hover if description is hidden (Landing Page Preview Mode)
        // Otherwise pause on hover for better UX
        if (isHovered && !hideDescription) return;

        const tick = () => {
            if (savedCallback.current) savedCallback.current();
        };

        const timer = setInterval(tick, autoPlayInterval);

        return () => clearInterval(timer);
    }, [isHovered, autoPlayInterval, hideDescription]);

    // Calculate visual properties for each item based on its distance from current index
    const getCardStyle = (index: number) => {
        const total = items.length;

        // Calculate circular distance
        // e.g. if current is 0: 
        // index 1 is distance 1 (Right)
        // index 5 (last) is distance -1 (Left)
        let distance = (index - currentIndex) % total;

        // Adjust for wrapping to find shortest path
        if (distance > total / 2) distance -= total;
        if (distance < -total / 2) distance += total;

        // Determine visual state based on distance
        // We only show Center (0), Left (-1), Right (1)
        // Others are hidden behind center

        const isActive = distance === 0;
        const isNext = distance === 1;
        const isPrev = distance === -1;

        // Constants for animation
        const xOffset = "35%"; // Percentage of container width
        const scaleActive = 1;
        const scaleSide = 0.8;
        const opacityActive = 1;
        const opacitySide = 0.5;

        if (isActive) {
            return {
                zIndex: 30,
                x: "0%",
                scale: scaleActive,
                opacity: opacityActive,
                display: "block",
                filter: "blur(0px) brightness(1)",
            };
        } else if (isNext) {
            return {
                zIndex: 20,
                x: xOffset,
                scale: scaleSide,
                opacity: opacitySide,
                display: "block",
                filter: "blur(2px) brightness(0.7)",
            };
        } else if (isPrev) {
            return {
                zIndex: 20,
                x: `-${xOffset}`,
                scale: scaleSide,
                opacity: opacitySide,
                display: "block",
                filter: "blur(2px) brightness(0.7)",
            };
        } else {
            // Hidden items
            // We animate them to the "center" but behind, so they can slide out nicely
            return {
                zIndex: 10,
                x: "0%",
                scale: 0.2,
                opacity: 0,
                display: "block", // Keep in DOM for smooth transition
                filter: "blur(10px)",
            };
        }
    };

    return (
        <div
            className={`relative w-full ${hideDescription ? 'h-[320px]' : 'h-[500px]'} md:h-[600px] flex flex-col items-center justify-center overflow-hidden`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel Container */}
            <div className={`relative w-full max-w-7xl ${hideDescription ? 'h-[280px]' : 'h-[380px]'} md:h-[450px] flex items-center justify-center perspective-1000`}>
                {items.map((item, index) => {
                    const style = getCardStyle(index);
                    const isInteractive = style.zIndex === 30 || style.zIndex === 20;

                    return (
                        <motion.div
                            key={item.id}
                            initial={false}
                            animate={style}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1], // Custom bouncy ease or smooth spline
                            }}
                            className={`absolute top-0 w-[85%] md:w-[45%] lg:w-[40%] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 origin-center ${isInteractive ? 'cursor-pointer' : 'pointer-events-none'}`}
                            onClick={() => {
                                if (style.x.includes("-")) handlePrev();
                                else if (!style.x.includes("0%")) handleNext();
                            }}
                            // Only apply hover effect to the active card
                            whileHover={style.zIndex === 30 ? { scale: 1.02 } : {}}
                        >
                            <div className="relative aspect-[16/9]">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className={`p-4 md:p-6 bg-zinc-900/95 backdrop-blur-sm ${hideDescription ? 'h-[100px]' : 'h-[160px] md:h-[200px]'} flex flex-col`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 pr-4">
                                        <span className="text-brand-primary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 md:mb-1 block">
                                            {item.category}
                                        </span>
                                        <h3 className="text-lg md:text-2xl font-bold text-white truncate">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <motion.a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, backgroundColor: "#00C853" }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 md:p-2.5 rounded-full bg-white text-black transition-colors flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink size={16} className="md:w-4.5 md:h-4.5" />
                                    </motion.a>
                                </div>

                                {!hideDescription && (
                                    <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {item.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] md:text-xs text-gray-300 border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Navigation Buttons (Floating) */}
                <button
                    className="absolute left-2 md:left-12 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-brand-primary hover:text-black transition-all hover:scale-110 backdrop-blur-md border border-white/10"
                    onClick={handlePrev}
                >
                    <ArrowLeft size={18} className="md:w-6 md:h-6" />
                </button>
                <button
                    className="absolute right-2 md:right-12 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-brand-primary hover:text-black transition-all hover:scale-110 backdrop-blur-md border border-white/10"
                    onClick={handleNext}
                >
                    <ArrowRight size={18} className="md:w-6 md:h-6" />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className={`flex gap-3 ${hideDescription ? 'mt-2' : 'mt-8'} z-50`}>
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-500 rounded-full h-1.5 ${index === currentIndex ? "w-8 bg-brand-primary shadow-[0_0_10px_rgba(0,200,83,0.5)]" : "w-1.5 bg-zinc-800 hover:bg-zinc-600"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
