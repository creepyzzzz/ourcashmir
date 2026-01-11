'use client';

import { Bell, Search, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchUser, Profile } from '@/lib/data';

interface TopNavProps {
    sidebarCollapsed?: boolean;
}

export default function TopNav({ sidebarCollapsed = false }: TopNavProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        fetchUser().then(data => setUser(data));
    }, []);

    // Simple logic to get title from pathname
    const getTitle = () => {
        if (pathname === '/dashboard') return 'Dashboard';
        const segment = pathname.split('/').pop();
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Dashboard';
    };

    return (
        <header className={`h-16 bg-brand-surface/50 backdrop-blur-md border-b border-brand-primary/5 fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
            }`}>
            {/* Left: Title / Breadcrumb */}
            <div>
                <h1 className="text-xl font-bold text-brand-white tracking-tight">{getTitle()}</h1>
            </div>

            {/* Center: Search (Optional / Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6 bg-brand-dark rounded-full px-4 py-2 border border-brand-primary/10 focus-within:border-brand-primary/30 transition-colors">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm text-brand-white w-full placeholder:text-gray-600"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-brand-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-brand-surface" />
                </button>

                <div className="h-8 w-[1px] bg-white/10" />

                <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-brand-white leading-none">{user?.full_name || 'Loading...'}</p>
                        <p className="text-xs text-gray-500 leading-none mt-1 uppercase">{user?.company || '...'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-5 h-5 text-brand-primary" />
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}
