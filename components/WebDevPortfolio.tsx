import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

interface WebDevPortfolioProps {
    hideDescription?: boolean;
    layout?: 'carousel' | 'grid';
}

export const WebDevPortfolio: React.FC<WebDevPortfolioProps> = ({ hideDescription = false, layout = 'carousel' }) => {
    return (
        <section id="web-dev-work" className={`pt-6 pb-2 sm:pt-12 sm:pb-8 md:pt-8 md:pb-12 bg-black transition-colors duration-500 ${!hideDescription ? 'min-h-screen' : ''}`}>
            {hideDescription && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex justify-center text-center">
                    <Reveal>
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-white">
                            Web Development <span className="text-brand-primary">Projects</span>
                        </h2>
                    </Reveal>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {!hideDescription && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-12 gap-3 sm:gap-6">
                        <div className="max-w-xl">
                            <Reveal>
                                <h2 className="text-xl sm:text-3xl md:text-5xl font-display font-bold text-brand-white mb-2 sm:mb-4 tracking-tight">
                                    Our Work
                                </h2>
                            </Reveal>
                            <Reveal delay={0.1}>
                                <p className="text-gray-400 text-sm sm:text-lg font-light leading-relaxed">
                                    Crafting digital experiences that merge functionality with aesthetic excellence.
                                </p>
                            </Reveal>
                        </div>
                    </div>
                )}
            </div>

            {
                layout === 'carousel' ? (
                    <div className={`${hideDescription ? 'mt-0' : 'mt-4 sm:mt-16'} w-full max-w-[1920px] mx-auto`}>
                        <ThreeDCarousel items={projects} hideDescription={hideDescription} />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-20">
                        {projects.map((project, idx) => (
                            <Reveal key={project.id} delay={idx * 0.1}>
                                <div className="group bg-brand-surface rounded-3xl overflow-hidden border border-brand-primary/10 hover:border-brand-primary/30 transition-all duration-500 shadow-2xl">
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-brand-primary text-black px-8 py-3 rounded-full font-bold text-sm tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                                            >
                                                VIEW LIVE SITE
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">{project.category}</span>
                                                <h3 className="text-2xl font-bold text-brand-white mt-1">{project.title}</h3>
                                            </div>
                                            <span className="text-gray-500 font-mono text-sm">{project.year}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-brand-primary/5 rounded-full text-[10px] text-brand-primary/80 border border-brand-primary/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )
            }
        </section >
    );
};
