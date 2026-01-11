
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    ChevronRight
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
}

export default function Sidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
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

    const toggleSidebar = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem('sidebar_collapsed', String(newValue));
        onToggle?.(newValue);
    };

    return (
        <aside
            className={`hidden lg:flex flex-col h-screen bg-brand-surface border-r border-brand-primary/10 fixed left-0 top-0 text-gray-300 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Brand */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-brand-primary/5">
                <Link href="/dashboard" className="flex items-center gap-2 group overflow-hidden">
                    <div className="w-3 h-3 bg-brand-primary rounded-full group-hover:animate-pulse shrink-0" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-bold tracking-tight text-lg text-brand-white font-display whitespace-nowrap overflow-hidden"
                            >
                                OURCASHMIR
                            </motion.span>
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
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {!isCollapsed && (
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive
                                    ? 'text-brand-white bg-brand-primary/10'
                                    : 'text-gray-400 hover:text-brand-white hover:bg-white/5'
                                }
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
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
                    <div className="mt-8 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Support
                    </div>
                )}
                {isCollapsed && <div className="h-6" />}
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive
                                    ? 'text-brand-white bg-brand-primary/10'
                                    : 'text-gray-400 hover:text-brand-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Team Section */}
            <div className="p-3 border-t border-brand-primary/5">
                <div className={`bg-brand-dark/50 rounded-xl p-3 flex items-center gap-3 border border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                        C
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-brand-white truncate">Client User</p>
                                <p className="text-[10px] text-gray-500 truncate">Active Plan</p>
                            </div>
                            <button className="text-gray-400 hover:text-brand-white">
                                <LogOut size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
