
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Briefcase,
    AlertCircle,
    DollarSign,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                // Dynamic import to avoid server/client issues if fetchStats uses something incompatible, 
                // but fetchStats uses supabase client which is fine.
                const { fetchStats } = await import('@/lib/data');
                const data = await fetchStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load stats", err);
                // Fallback for demo if DB is empty
                setStats({
                    totalRevenue: 0,
                    activeProjects: 0,
                    totalClients: 0,
                    pendingApprovals: 0
                });
            }
        }
        loadStats();
    }, []);

    if (!stats) return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;

    const cards = [
        {
            label: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            change: '+12.5%', // Calculation would need historical data, keeping mock for delta
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'Active Projects',
            value: stats.activeProjects,
            change: '+3 new',
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Total Clients',
            value: stats.totalClients,
            change: 'Stable',
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Pending Approvals',
            value: stats.pendingApprovals,
            change: 'Action Needed',
            icon: AlertCircle,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-gray-400 mt-1">Welcome back, here's what's happening at OurCashmir today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-brand-surface border border-white/5 p-6 rounded-xl hover:border-brand-primary/20 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.color} bg-opacity-10 bg-white`}>
                                {card.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                            <h3 className="text-2xl font-bold mt-1 text-white group-hover:text-brand-primary transition-colors">
                                {card.value}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity / Quick Actions - Placeholder for now */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-brand-surface border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col justify-center items-center text-gray-500">
                    <p>Revenue & Growth Chart</p>
                    <span className="text-xs opacity-50">(Recharts Integration Coming Soon)</span>
                </div>

                {/* Quick Actions List */}
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link href="/admin/clients" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-sm font-medium">Add New Client</span>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/admin/projects" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-sm font-medium">Create Project</span>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/admin/invoices" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-sm font-medium">Generate Invoice</span>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
