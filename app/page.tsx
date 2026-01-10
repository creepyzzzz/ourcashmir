"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Team from '@/components/Team';
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
                <Testimonials />
                <Team />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
