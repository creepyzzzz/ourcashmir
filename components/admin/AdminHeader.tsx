
'use client';

import { Bell, Search, User as UserIcon, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
    sidebarCollapsed?: boolean;
}

export default function AdminHeader({ sidebarCollapsed = false }: AdminHeaderProps) {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === '/admin') return 'Dashboard';
        const parts = pathname.split('/');
        // admin / clients / [id]
        if (parts.length > 3) return 'Details';
        const segment = parts[2]; // admin, [clients]
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Dashboard';
    };

    return (
        <header className={`h-16 bg-brand-surface/50 backdrop-blur-md border-b border-brand-primary/5 fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
            }`}>
            {/* Left: Title / Breadcrumb */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-gray-400 hover:text-white">
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-brand-white tracking-tight">{getTitle()}</h1>
            </div>

            {/* Center: Global Search */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-6 bg-brand-dark rounded-full px-4 py-2 border border-brand-primary/10 focus-within:border-brand-primary/30 transition-colors">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search clients, projects, or tasks..."
                    className="bg-transparent border-none outline-none text-sm text-brand-white w-full placeholder:text-gray-600"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <button className="relative p-2 text-gray-400 hover:text-brand-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-brand-surface" />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-brand-white leading-none">Admin User</p>
                        <p className="text-xs text-gray-500 leading-none mt-1 uppercase">System Admin</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-5 h-5 text-brand-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
