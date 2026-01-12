'use client';

import React, { useState, useEffect } from 'react';
import BlogSidebar from './BlogSidebar';
import BlogTopNav from './BlogTopNav';

export default function BlogLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load sidebar state
        const saved = localStorage.getItem('blog_sidebar_collapsed');
        if (saved !== null) {
            setSidebarCollapsed(saved === 'true');
        }
        setMounted(true);
    }, []);

    // Close mobile menu on route change or resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-brand-darker text-brand-white font-sans selection:bg-brand-primary/30">
            <BlogSidebar
                collapsed={sidebarCollapsed}
                onToggle={setSidebarCollapsed}
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
            <BlogTopNav
                sidebarCollapsed={sidebarCollapsed}
                onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            {/* Main Content Wrapper */}
            <main className={`pt-14 lg:pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}>
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
