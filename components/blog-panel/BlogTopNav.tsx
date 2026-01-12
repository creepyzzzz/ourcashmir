'use client';

import { Bell, Search, User as UserIcon, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface TopNavProps {
    sidebarCollapsed?: boolean;
    onMobileMenuToggle?: () => void;
}

export default function BlogTopNav({ sidebarCollapsed = false, onMobileMenuToggle }: TopNavProps) {
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUserEmail(data.user?.email || null);
        });
    }, []);

    // Simple logic to get title from pathname
    const getTitle = () => {
        if (pathname === '/blog-panel') return 'Dashboard';
        if (pathname === '/blog-panel/posts') return 'All Posts';
        if (pathname === '/blog-panel/posts/create') return 'Create New Post';
        if (pathname === '/blog-panel/media') return 'Media Library';
        if (pathname === '/blog-panel/categories') return 'Categories';
        if (pathname === '/blog-panel/tags') return 'Tags';

        const segment = pathname.split('/').pop();
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Blog Panel';
    };

    return (
        <header className={`h-14 lg:h-16 bg-brand-surface/50 backdrop-blur-md border-b border-brand-primary/5 fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-3 sm:px-4 lg:px-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
            }`}>
            {/* Left: Mobile Menu + Title */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-brand-white tracking-tight truncate">{getTitle()}</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="hidden sm:block text-xs text-gray-500">
                    {userEmail}
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary border border-brand-primary/30">
                    <UserIcon size={16} />
                </div>
            </div>
        </header>
    );
}
