
'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, User as UserIcon, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { fetchUser, Profile } from '@/lib/data';

interface AdminHeaderProps {
    sidebarCollapsed?: boolean;
    onMobileMenuToggle?: () => void;
}

export default function AdminHeader({ sidebarCollapsed = false, onMobileMenuToggle }: AdminHeaderProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<Profile | null>(null);

    const loadUser = async () => {
        const profile = await fetchUser();
        if (profile) {
            // @ts-ignore
            setUser(profile);
        }
    };

    useEffect(() => {
        loadUser();

        // Listen for updates from Settings page
        const handleProfileUpdate = () => {
            loadUser();
        };
        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => window.removeEventListener('profile-updated', handleProfileUpdate);
    }, []);

    const getTitle = () => {
        if (pathname === '/admin') return 'Dashboard';
        const parts = pathname.split('/');
        // admin / clients / [id]
        if (parts.length > 3) return 'Details';
        const segment = parts[2]; // admin, [clients]
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Dashboard';
    };

    return (
        <header className={`h-14 lg:h-16 bg-brand-surface/50 backdrop-blur-md border-b border-brand-primary/5 fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-3 lg:px-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
            }`}>
            {/* Left: Title / Breadcrumb */}
            <div className="flex items-center gap-2 lg:gap-4">
                <button
                    className="lg:hidden p-1.5 lg:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    onClick={onMobileMenuToggle}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-base lg:text-xl font-bold text-brand-white tracking-tight">{getTitle()}</h1>
            </div>

            {/* Center: Global Search */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-4 lg:mx-6 bg-brand-dark rounded-full px-3 lg:px-4 py-1.5 lg:py-2 border border-brand-primary/10 focus-within:border-brand-primary/30 transition-colors">
                <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search clients, projects, or tasks..."
                    className="bg-transparent border-none outline-none text-xs lg:text-sm text-brand-white w-full placeholder:text-gray-600"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
                <div className="flex items-center gap-1 lg:gap-2">
                    <button className="relative p-1.5 lg:p-2 text-gray-400 hover:text-brand-white transition-colors">
                        <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="absolute top-1 right-1 lg:top-1.5 lg:right-1.5 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full border border-brand-surface" />
                    </button>
                </div>

                <div className="h-6 lg:h-8 w-[1px] bg-white/10" />

                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs lg:text-sm font-medium text-brand-white leading-none">{user?.full_name || 'Admin User'}</p>
                        <p className="text-[10px] lg:text-xs text-gray-500 leading-none mt-0.5 lg:mt-1 uppercase">{user?.role?.replace('_', ' ') || 'System Admin'}</p>
                    </div>
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 text-brand-primary" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

