'use client';

import React from 'react';
import { Reveal } from './ui/Reveal';
import { ProjectItem } from '@/types';
import { ThreeDCarousel } from './ui/three-d-carousel';

// Exact projects list as requested
const projects: ProjectItem[] = [
    {
        id: "chaingpt-clone",
        title: "ChainGPT Clone",
        category: "AI & Web3",
        year: "2026",
        image: "https://i.ibb.co/0R595QVW/Screenshot-2026-01-05-145255.png",
        description: "A clone of ChainGPT Labs - an AI-powered Web3 infrastructure platform that integrates artificial intelligence with blockchain technology. Features include AI chatbots for crypto queries, NFT generators, smart contract development tools, and blockchain analytics for the decentralized ecosystem.",
        tags: ["AI", "Web3", "Blockchain"],
        link: "https://chaingptclone.vercel.app"
    },
    {
        id: "softspace",
        title: "Softspace",
        category: "Design Agency",
        year: "2026",
        image: "https://i.ibb.co/7dHDS3rF/Screenshot-2026-01-02-202836.png",
        description: "A cutting-edge design agency website showcasing limitless design solutions with stunning 3D graphics, vibrant purple aesthetics, and comprehensive services including brand identity creation, web & mobile design, and UI/UX design with a modern, interactive approach.",
        tags: ["Design Agency", "3D Graphics", "Branding"],
        link: "https://thesoftspace.vercel.app"
    },
    {
        id: "burgee",
        title: "Burgee",
        category: "Food & Beverage",
        year: "2026",
        image: "https://i.ibb.co/3mwhDrwy/Screenshot-2026-01-01-214926.png",
        description: "A premium, highly interactive food brand landing page featuring smooth animations, dynamic layouts, and a 'liquid glass' aesthetic. Designed to showcase signature burgers with an immersive visual experience.",
        tags: ["Food", "Web Design", "Interaction"],
        link: "https://theburgee.vercel.app"
    },
    {
        id: "1",
        title: "PIXELFUEL",
        category: "Marketing Agency",
        year: "2024",
        image: "https://i.ibb.co/spmLfMx8/Screenshot-2025-12-31-180520.png",
        description: "A modern, vibrant marketing agency website featuring cutting-edge design, seamless user experience, and engaging visual storytelling to showcase creative services and drive client engagement.",
        tags: ["Marketing", "Web Design", "Agency"],
        link: "https://pixelfuel.vercel.app/"
    },
    {
        id: "2",
        title: "Neuera",
        category: "Marketing Agency",
        year: "2024",
        image: "https://i.ibb.co/HTDH2jJQ/Screenshot-2025-12-31-175613.png",
        description: "A sophisticated marketing agency website designed to elevate brand presence with modern aesthetics, intuitive navigation, and compelling content that converts visitors into clients.",
        tags: ["Marketing", "Web Design", "Agency"],
        link: "https://theneuera.vercel.app/"
    },
    {
        id: "3",
        title: "MCQ Platform",
        category: "Educational Platform",
        year: "2024",
        image: "https://i.ibb.co/kswFfQcf/Screenshot-2025-12-21-192457.png",
        description: "A comprehensive online examination platform enabling institutions to conduct MCQ-based assessments with real-time monitoring, automated grading, and detailed analytics for enhanced educational outcomes.",
        tags: ["Education", "Assessment", "Full-Stack"],
        link: "https://aspireexamine.site"
    }
];

export const WebDevPortfolio: React.FC = () => {
    return (
        <section id="work" className="pt-8 pb-4 sm:pt-12 sm:pb-8 md:pt-8 md:pb-12 bg-zinc-50 dark:bg-black transition-colors duration-500 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
                    <div className="max-w-xl">
                        <Reveal>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                                Our Work
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
                                Crafting digital experiences that merge functionality with aesthetic excellence.
                            </p>
                        </Reveal>
                    </div>
                    {/* View All Projects button removed as per request */}
                </div>
            </div>

            <div className="mt-8 sm:mt-16 w-full max-w-[1920px] mx-auto">
                <ThreeDCarousel items={projects} />
            </div>
        </section>
    );
};
