"use client";

import React from 'react';
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
import CreatorApplication from '@/components/CreatorApplication';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden selection:bg-brand-yellow selection:text-brand-black">
            <Navbar />
            <main>
                <Hero />
                <Stats />
                <About />
                <Services />
                <PortfolioPreview />
                <InfluencerPreview />
                <CreatorManagement />
                <ClientsPreview />
                <TestimonialSection />
                <CreatorApplication />

                <CTA />
            </main>
            <Footer />
        </div>
    );
}
