'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    MessageSquare,
    FileText,
    CreditCard,
    Shield,
    Settings,
    LogOut,
    UserPlus,
    BarChart3,
    UsersRound,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUser, Profile } from '@/lib/data';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Clients', href: '/admin/clients', icon: Users },
    { label: 'Projects', href: '/admin/projects', icon: Briefcase },
    { label: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    { label: 'Approvals', href: '/admin/approvals', icon: Shield },
    { label: 'Billing', href: '/admin/billing', icon: CreditCard },
    { label: 'Leads', href: '/admin/leads', icon: UserPlus },
    { label: 'Team', href: '/admin/team', icon: UsersRound },
];

const BOTTOM_ITEMS = [
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
    collapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ collapsed: controlledCollapsed, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<Profile | null>(null);

    // Sync with controlled state if provided
    useEffect(() => {
        if (controlledCollapsed !== undefined) {
            setIsCollapsed(controlledCollapsed);
        }
    }, [controlledCollapsed]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('admin_sidebar_collapsed');
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }
    }, []);

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

    const toggleSidebar = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem('admin_sidebar_collapsed', String(newValue));
        onToggle?.(newValue);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.replace('/');
    };

    return (
        <aside
            className={`hidden lg:flex flex-col h-screen bg-brand-surface border-r border-brand-primary/10 fixed left-0 top-0 text-gray-300 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Brand */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-brand-primary/5">
                <Link href="/admin" className="flex items-center gap-2 group overflow-hidden">
                    <div className="w-3 h-3 bg-brand-primary rounded-full group-hover:animate-pulse shrink-0" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
                            >
                                <span className="font-bold tracking-tight text-lg text-brand-white font-display">OURCASHMIR</span>
                                <span className="text-[10px] font-medium text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">ADMIN</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {!isCollapsed && (
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Overview
                    </div>
                )}
                {/* Dashboard Item */}
                {NAV_ITEMS.slice(0, 1).map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavAdmin"
                                    className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {!isCollapsed && (
                    <div className="mt-4 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Management
                    </div>
                )}
                {isCollapsed && <div className="h-4" />}
                {NAV_ITEMS.slice(1).map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavAdmin"
                                    className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {!isCollapsed && (
                    <div className="mt-6 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        System
                    </div>
                )}
                {isCollapsed && <div className="h-4" />}
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Admin User Section */}
            <div className="p-3 border-t border-brand-primary/5">
                <div className={`bg-brand-dark/50 rounded-xl p-3 flex items-center gap-3 border border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0 overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs">{user?.full_name?.substring(0, 1).toUpperCase() || 'A'}</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-brand-white truncate">{user?.full_name || 'Administrator'}</p>
                                <p className="text-[10px] text-gray-500 truncate">{user?.role?.toUpperCase() || 'Super Admin'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-brand-white"
                                title="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
