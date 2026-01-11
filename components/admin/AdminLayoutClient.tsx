'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Load sidebar state
        const saved = localStorage.getItem('admin_sidebar_collapsed');
        if (saved !== null) {
            setSidebarCollapsed(saved === 'true');
        }

        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className="min-h-screen bg-brand-darker font-sans text-brand-white selection:bg-brand-primary/30">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={setSidebarCollapsed}
            />
            <AdminHeader sidebarCollapsed={sidebarCollapsed} />
            <main className={`pt-16 min-h-screen p-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}>
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
