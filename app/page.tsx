"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Services from '@/components/Services';
import PortfolioPreview from '@/components/PortfolioPreview';
import InfluencerPreview from '@/components/InfluencerPreview';
import ClientsPreview from '@/components/ClientsPreview';
import TestimonialSection from '@/components/TestimonialSection';

import CreatorManagement from '@/components/CreatorManagement';
import { WebDevPortfolio } from '@/components/WebDevPortfolio';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />
            <main>
                <Hero />
                <Stats />
                <About />
                <Services />
                <PortfolioPreview />
                <div className="bg-black pt-20">
                    <WebDevPortfolio hideDescription={true} />
                    <div className="flex justify-center pb-20">
                        <Link href="/web-development">
                            <button className="group flex items-center gap-3 bg-brand-surface border border-brand-primary/20 text-brand-white px-8 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-brand-primary hover:text-black transition-all">
                                VIEW ALL WEB PROJECTS
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
                <InfluencerPreview />
                <CreatorManagement />
                <ClientsPreview />
                <TestimonialSection />

                <CTA />
            </main>
            <Footer />
        </div>
    );
}
