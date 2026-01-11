
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    CheckSquare,
    MessageSquare,
    Settings,
    LogOut,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: Briefcase },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Approvals', href: '/approvals', icon: CheckSquare },
    { label: 'Billing', href: '/billing', icon: CreditCard },
    { label: 'Messages', href: '/communication', icon: MessageSquare },
];

const BOTTOM_ITEMS = [
    { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export default function Sidebar({ collapsed: controlledCollapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Sync with controlled state if provided
    useEffect(() => {
        if (controlledCollapsed !== undefined) {
            setIsCollapsed(controlledCollapsed);
        }
    }, [controlledCollapsed]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sidebar_collapsed');
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }
    }, []);

    // Close mobile menu on navigation
    useEffect(() => {
        if (mobileOpen && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleSidebar = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem('sidebar_collapsed', String(newValue));
        onToggle?.(newValue);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.replace('/');
    };

    // Desktop Sidebar Content
    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Brand */}
            <div className={`h-14 lg:h-16 flex items-center justify-between px-3 lg:px-4 border-b border-brand-primary/5 ${isMobile ? 'pr-2' : ''}`}>
                <Link href="/dashboard" className="flex items-center gap-2 group overflow-hidden" onClick={isMobile ? onMobileClose : undefined}>
                    <div className="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-brand-primary rounded-full group-hover:animate-pulse shrink-0" />
                    {(isMobile || !isCollapsed) && (
                        <span className="font-bold tracking-tight text-base lg:text-lg text-brand-white font-display whitespace-nowrap overflow-hidden">
                            OURCASHMIR
                        </span>
                    )}
                </Link>
                {isMobile ? (
                    <button
                        onClick={onMobileClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
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
            <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-2 lg:px-3 space-y-1">
                {(isMobile || !isCollapsed) && (
                    <div className="px-3 mb-2 text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        General
                    </div>
                )}
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!isMobile && isCollapsed ? item.label : undefined}
                            onClick={isMobile ? onMobileClose : undefined}
                            className={`
                                relative flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200
                                ${!isMobile && isCollapsed ? 'justify-center' : ''}
                                ${isActive
                                    ? 'text-brand-white bg-brand-primary/10'
                                    : 'text-gray-400 hover:text-brand-white hover:bg-white/5'
                                }
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={isMobile ? "mobileActiveNav" : "activeNav"}
                                    className="absolute left-0 w-0.5 lg:w-1 h-5 lg:h-6 bg-brand-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {(isMobile || !isCollapsed) && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {(isMobile || !isCollapsed) && (
                    <div className="mt-6 lg:mt-8 px-3 mb-2 text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Support
                    </div>
                )}
                {!isMobile && isCollapsed && <div className="h-6" />}
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!isMobile && isCollapsed ? item.label : undefined}
                            onClick={isMobile ? onMobileClose : undefined}
                            className={`
                                relative flex items-center gap-2.5 lg:gap-3 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200
                                ${!isMobile && isCollapsed ? 'justify-center' : ''}
                                ${isActive
                                    ? 'text-brand-white bg-brand-primary/10'
                                    : 'text-gray-400 hover:text-brand-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {(isMobile || !isCollapsed) && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Team Section */}
            <div className="p-2 lg:p-3 border-t border-brand-primary/5">
                <div className={`bg-brand-dark/50 rounded-lg lg:rounded-xl p-2 lg:p-3 flex items-center gap-2 lg:gap-3 border border-white/5 ${!isMobile && isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0 text-xs lg:text-sm">
                        C
                    </div>
                    {(isMobile || !isCollapsed) && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] lg:text-xs font-medium text-brand-white truncate">Client User</p>
                                <p className="text-[9px] lg:text-[10px] text-gray-500 truncate">Active Plan</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-brand-white p-1"
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
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={onMobileClose}
                        />
                        {/* Mobile Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-brand-surface border-r border-brand-primary/10 z-50 flex flex-col text-gray-300"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

