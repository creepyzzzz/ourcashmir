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
    ChevronRight,
    X
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
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export default function AdminSidebar({ collapsed: controlledCollapsed, onToggle, mobileOpen = false, onMobileClose }: AdminSidebarProps) {
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

    // Close mobile sidebar on route change
    useEffect(() => {
        onMobileClose?.();
    }, [pathname]);

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

    // Shared sidebar content
    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Brand */}
            <div className="h-14 lg:h-16 flex items-center justify-between px-3 lg:px-4 border-b border-brand-primary/5">
                <Link href="/admin" className="flex items-center gap-2 group overflow-hidden" onClick={isMobile ? onMobileClose : undefined}>
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-brand-primary rounded-full group-hover:animate-pulse shrink-0" />
                    <AnimatePresence mode="wait">
                        {(!isCollapsed || isMobile) && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex items-center gap-1.5 lg:gap-2 whitespace-nowrap overflow-hidden"
                            >
                                <span className="font-bold tracking-tight text-base lg:text-lg text-brand-white font-display">OURCASHMIR</span>
                                <span className="text-[8px] lg:text-[10px] font-medium text-brand-primary bg-brand-primary/10 px-1 lg:px-1.5 py-0.5 rounded">ADMIN</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
                {isMobile ? (
                    <button
                        onClick={onMobileClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                ) : (
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 lg:py-4 px-2 lg:px-3 space-y-0.5 lg:space-y-1">
                {(!isCollapsed || isMobile) && (
                    <div className="px-2 lg:px-3 mb-1.5 lg:mb-2 text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                            title={(isCollapsed && !isMobile) ? item.label : undefined}
                            onClick={isMobile ? onMobileClose : undefined}
                            className={`
                                relative flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200
                                ${(isCollapsed && !isMobile) ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={isMobile ? "activeNavAdminMobile" : "activeNavAdmin"}
                                    className="absolute left-0 w-0.5 lg:w-1 h-5 lg:h-6 bg-brand-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {(!isCollapsed || isMobile) && (
                    <div className="mt-3 lg:mt-4 px-2 lg:px-3 mb-1.5 lg:mb-2 text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Management
                    </div>
                )}
                {(isCollapsed && !isMobile) && <div className="h-3 lg:h-4" />}
                {NAV_ITEMS.slice(1).map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={(isCollapsed && !isMobile) ? item.label : undefined}
                            onClick={isMobile ? onMobileClose : undefined}
                            className={`
                                relative flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200
                                ${(isCollapsed && !isMobile) ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={isMobile ? "activeNavAdminMobile" : "activeNavAdmin"}
                                    className="absolute left-0 w-0.5 lg:w-1 h-5 lg:h-6 bg-brand-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {(!isCollapsed || isMobile) && (
                    <div className="mt-4 lg:mt-6 px-2 lg:px-3 mb-1.5 lg:mb-2 text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        System
                    </div>
                )}
                {(isCollapsed && !isMobile) && <div className="h-3 lg:h-4" />}
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={(isCollapsed && !isMobile) ? item.label : undefined}
                            onClick={isMobile ? onMobileClose : undefined}
                            className={`
                                relative flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200
                                ${(isCollapsed && !isMobile) ? 'justify-center' : ''}
                                ${isActive ? 'text-brand-white bg-brand-primary/10' : 'text-gray-400 hover:text-brand-white hover:bg-white/5'}
                            `}
                        >
                            <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Admin User Section */}
            <div className="p-2 lg:p-3 border-t border-brand-primary/5">
                <div className={`bg-brand-dark/50 rounded-lg lg:rounded-xl p-2 lg:p-3 flex items-center gap-2 lg:gap-3 border border-white/5 ${(isCollapsed && !isMobile) ? 'justify-center' : ''}`}>
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0 overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] lg:text-xs">{user?.full_name?.substring(0, 1).toUpperCase() || 'A'}</span>
                        )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] lg:text-xs font-medium text-brand-white truncate">{user?.full_name || 'Administrator'}</p>
                                <p className="text-[8px] lg:text-[10px] text-gray-500 truncate">{user?.role?.toUpperCase() || 'Super Admin'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-brand-white"
                                title="Sign out"
                            >
                                <LogOut size={14} className="lg:w-4 lg:h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col h-screen bg-brand-surface border-r border-brand-primary/10 fixed left-0 top-0 text-gray-300 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        {/* Mobile Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-brand-surface border-r border-brand-primary/10 text-gray-300 z-50 flex flex-col"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
