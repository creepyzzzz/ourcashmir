'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load sidebar state
        const saved = localStorage.getItem('sidebar_collapsed');
        if (saved !== null) {
            setSidebarCollapsed(saved === 'true');
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-brand-darker text-brand-white font-sans selection:bg-brand-primary/30">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={setSidebarCollapsed}
            />
            <TopNav sidebarCollapsed={sidebarCollapsed} />
            {/* Main Content Wrapper */}
            <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}>
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
