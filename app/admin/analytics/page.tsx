
'use client';

import React from 'react';
import { TrendingUp, BarChart3, Users, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
    const metrics = [
        { label: 'Avg. Campaign ROI', value: '324%', change: '+12%', positive: true, icon: TrendingUp },
        { label: 'Client Retention', value: '94%', change: '+3%', positive: true, icon: Users },
        { label: 'Projects Delivered', value: '47', change: '+8', positive: true, icon: Target },
        { label: 'Avg. Project Value', value: '$12,500', change: '-2%', positive: false, icon: BarChart3 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Insights</h1>
                <p className="text-gray-400 text-sm mt-1">Agency-wide performance metrics and campaign analytics.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.label} className="bg-brand-surface border border-white/5 p-6 rounded-xl hover:border-brand-primary/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
                                <metric.icon size={20} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-medium ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {metric.change}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">{metric.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{metric.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6 min-h-[300px]">
                    <h3 className="font-bold mb-4">Revenue by Service Type</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-lg">
                        <p className="text-sm">Pie Chart Visualization</p>
                    </div>
                </div>
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6 min-h-[300px]">
                    <h3 className="font-bold mb-4">Monthly Revenue Trend</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-lg">
                        <p className="text-sm">Line Chart Visualization</p>
                    </div>
                </div>
            </div>

            {/* Top Performing Section */}
            <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                <h3 className="font-bold mb-4">Top Performing Campaigns (This Quarter)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs uppercase text-gray-500 border-b border-white/5">
                            <tr>
                                <th className="py-3">Campaign</th>
                                <th className="py-3">Client</th>
                                <th className="py-3">Spend</th>
                                <th className="py-3">Revenue</th>
                                <th className="py-3">ROI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.02]">
                                <td className="py-3 font-medium text-white">Q1 Brand Awareness</td>
                                <td className="py-3 text-gray-400">Business Corp</td>
                                <td className="py-3">$5,000</td>
                                <td className="py-3 text-green-500">$18,500</td>
                                <td className="py-3"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">270%</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                                <td className="py-3 font-medium text-white">SaaS Launch MVP</td>
                                <td className="py-3 text-gray-400">TechFlow Solutions</td>
                                <td className="py-3">$12,000</td>
                                <td className="py-3 text-green-500">$45,000</td>
                                <td className="py-3"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">275%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
