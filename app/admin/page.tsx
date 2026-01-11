
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

    if (!stats) return <div className="p-4 lg:p-10 text-center text-gray-500">Loading dashboard...</div>;

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
        <div className="space-y-4 lg:space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-xl lg:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-gray-400 mt-0.5 lg:mt-1 text-xs lg:text-base">Welcome back, here's what's happening at OurCashmir today.</p>
            </div>

            {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-brand-surface border border-white/5 p-3 lg:p-6 rounded-lg lg:rounded-xl hover:border-brand-primary/20 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-2 lg:mb-4">
                            <div className={`p-1.5 lg:p-3 rounded-md lg:rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                            </div>
                            <span className={`text-[8px] lg:text-xs font-medium px-1 lg:px-2 py-0.5 lg:py-1 rounded-full ${card.color} bg-opacity-10 bg-white hidden sm:inline`}>
                                {card.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] lg:text-sm">{card.label}</p>
                            <h3 className="text-sm lg:text-2xl font-bold mt-0.5 lg:mt-1 text-white group-hover:text-brand-primary transition-colors truncate">
                                {card.value}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl p-3 lg:p-6 min-h-[200px] lg:min-h-[400px] flex flex-col">
                    <div className="mb-3 lg:mb-6">
                        <h3 className="text-sm lg:text-lg font-bold">Revenue & Growth</h3>
                        <p className="text-[10px] lg:text-sm text-gray-400">Monthly revenue overview</p>
                    </div>

                    <div className="flex-1 w-full min-h-[150px] lg:min-h-[300px]">
                        {/* Dynamic Import Recharts component wrapper to avoid SSR issues if any, though Recharts 2+ is usually fine with 'use client' */}
                        <RevenueChart data={revenueHistory} />
                    </div>
                </div>

                {/* Quick Actions List */}
                <div className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl p-3 lg:p-6">
                    <h3 className="text-sm lg:text-lg font-bold mb-2 lg:mb-4">Quick Actions</h3>
                    <div className="space-y-1.5 lg:space-y-3">
                        <Link href="/admin/clients" className="flex items-center justify-between p-2 lg:p-3 rounded-md lg:rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-xs lg:text-sm font-medium">Add New Client</span>
                            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/admin/projects" className="flex items-center justify-between p-2 lg:p-3 rounded-md lg:rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-xs lg:text-sm font-medium">Create Project</span>
                            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/admin/invoices" className="flex items-center justify-between p-2 lg:p-3 rounded-md lg:rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-xs lg:text-sm font-medium">Generate Invoice</span>
                            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/admin/reports" className="flex items-center justify-between p-2 lg:p-3 rounded-md lg:rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-all group">
                            <span className="text-xs lg:text-sm font-medium">Generate Report</span>
                            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <div className="h-full flex items-center justify-center text-gray-500 text-xs lg:text-base">
                No revenue data available yet.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: -20,
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
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                />
                <YAxis
                    stroke="#9ca3af"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    width={40}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
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
