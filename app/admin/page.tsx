
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [revenueHistory, setRevenueHistory] = useState<any[]>([]);

    useEffect(() => {
        async function loadStats() {
            try {
                const { fetchStats, fetchRevenueHistory } = await import('@/lib/data');
                const [statsData, historyData] = await Promise.all([
                    fetchStats(),
                    fetchRevenueHistory()
                ]);
                setStats(statsData);
                setRevenueHistory(historyData);
            } catch (err) {
                console.error("Failed to load stats", err);
                // Fallback
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const cards = [
        {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue || 0),
            change: '+12.5%', // Ideally calculated from history
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

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-brand-surface border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">Revenue & Growth</h3>
                        <p className="text-sm text-gray-400">Monthly revenue overview</p>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        {/* Dynamic Import Recharts component wrapper to avoid SSR issues if any, though Recharts 2+ is usually fine with 'use client' */}
                        <RevenueChart data={revenueHistory} />
                    </div>
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
                        <Link href="/admin/reports" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-sm font-medium">Generate Report</span>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Separate component for Chart to keep main component clean and handle any hydration issues if needed


function RevenueChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                No revenue data available yet.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    formatter={(value: any) => [`₹${(Number(value) || 0).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#818cf8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
