"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WebDevPortfolio } from '@/components/WebDevPortfolio';

export default function WebDevelopmentPage() {
    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />
            <main className="pt-20">
                <WebDevPortfolio layout="grid" />
            </main>
            <Footer />
        </div>
    );
}
