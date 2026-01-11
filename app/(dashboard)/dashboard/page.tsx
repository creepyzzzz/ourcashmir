'use client';

import React, { useEffect, useState } from 'react';
import {
    Activity,
    BarChart3,
    Users,
    Clock,
    ArrowRight,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import StatCard from '@/components/dashboard/StatCard';
import { fetchStats, fetchProjects, fetchApprovals, fetchInvoices, Project, ApprovalItem, StatCard as StatCardType } from '@/lib/data';
import { approveItem, rejectItem } from '@/actions/dashboard';



export default function DashboardPage() {
    const [stats, setStats] = useState<StatCardType[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
    const [chartData, setChartData] = useState<any[]>([]); // Dynamic chart data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, p, a, invoices] = await Promise.all([
                    fetchStats(),
                    fetchProjects(),
                    fetchApprovals(),
                    fetchInvoices() // Fetch invoices for chart
                ]);

                // Transform stats object to array
                const statsArray: StatCardType[] = [
                    {
                        title: "Total Spent",
                        value: `$${s.totalRevenue.toLocaleString()}`,
                        change: "+12% from last month", // mock/calculated
                        icon: <Activity size={20} />
                    },
                    {
                        title: "Active Projects",
                        value: s.activeProjects.toString(),
                        change: "Current",
                        icon: <BarChart3 size={20} />
                    },
                    {
                        title: "Pending Approvals",
                        value: s.pendingApprovals.toString(),
                        change: "Action Required",
                        icon: <Clock size={20} />
                    }
                ];

                // Process Invoices for Chart (Last 6 months)
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - 5 + i);
                    return d.toLocaleString('default', { month: 'short' });
                });

                const processedChartData = last6Months.map(month => {
                    // Simple mock-ish aggregation matching month name
                    // Real implementation needs date parsing from invoices
                    // For now, let's just show real data if available or 0
                    const monthInvoices = (invoices as any[]).filter(inv => {
                        const d = new Date(inv.created_at); // date or created_at
                        return d.toLocaleString('default', { month: 'short' }) === month;
                    });
                    const val = monthInvoices.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                    return { name: month, value: val };
                });

                // If no data, showing 0s might be ugly, but it's real. 
                // Let's use the processed data.
                setChartData(processedChartData);

                setStats(statsArray);
                setProjects(p);
                setApprovals(a);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleApprove = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click if wrapped
        e.stopPropagation();
        try {
            await approveItem(id);
            // Optimistic update
            setApprovals(prev => prev.filter(item => item.id !== id));
            // toast.success('Item approved successfully');
        } catch (error) {
            console.error(error);
            // toast.error('Failed to approve item');
        }
    };

    const handleReject = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await rejectItem(id);
            setApprovals(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
            </div>
        );
    }

    const icons = [<Activity key={1} size={20} />, <BarChart3 key={2} size={20} />, <Users key={3} size={20} />];

    return (
        <div className="space-y-6">

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        label={stat.title}
                        icon={icons[idx] || <Activity size={20} />}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Chart */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-brand-white">Overview</h3>
                        <select className="bg-brand-dark border border-brand-primary/20 text-xs text-gray-400 rounded-lg px-2 py-1 outline-none">
                            <option>Last 6 months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0D2012', borderColor: 'rgba(0,200,83,0.2)', color: '#fff' }}
                                    itemStyle={{ color: '#00C853' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#00C853" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Approvals */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-brand-white">Pending Approvals</h3>
                        <Link href="/approvals" className="text-xs text-brand-primary hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {approvals.length === 0 && (
                            <p className="text-gray-500 text-sm">No items pending approval.</p>
                        )}
                        {approvals.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-brand-primary/10">
                                <div className="h-16 w-24 bg-gray-800 rounded-md overflow-hidden relative shrink-0 flex items-center justify-center">
                                    {(item.type === 'image' && item.thumbnail) ? (
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-500">
                                            {item.type === 'video' ? <Activity size={24} /> : <BarChart3 size={24} />}
                                            {/* Note: In a real app we'd import FileText, Video etc. reusing existing imports for now */}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Clock className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-brand-white truncate">{item.title}</h4>
                                    <p className="text-xs text-gray-500 capitalize">{item.type} • Submitted {item.submitted_date}</p>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={(e) => handleApprove(item.id, e)}
                                            className="text-xs px-3 py-1 bg-brand-primary text-black font-bold rounded hover:bg-brand-secondary transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={(e) => handleReject(item.id, e)}
                                            className="text-xs px-3 py-1 bg-white/10 text-white hover:bg-white/20 rounded transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Projects */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-brand-white">Active Projects</h3>
                    <Link href="/projects" className="text-xs text-brand-primary hover:underline flex items-center gap-1">
                        View All Projects <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-800">
                                <th className="pb-3 pl-2 font-medium">Project Name</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Progress</th>
                                <th className="pb-3 font-medium">Dates</th>
                                <th className="pb-3 pr-2 text-right font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden shrink-0">
                                                <img src={project.thumbnail || '/images/placeholder.png'} alt={project.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-brand-white text-sm">{project.title}</div>
                                                <div className="text-xs text-gray-500">Marketing</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                            ${project.status === 'active' ? 'bg-green-500/10 text-brand-primary' :
                                                project.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-500'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-brand-primary' :
                                                project.status === 'completed' ? 'bg-blue-400' : 'bg-yellow-500'
                                                }`} />
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="py-4 max-w-[150px]">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-primary rounded-full"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400 w-8">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-xs text-gray-500">
                                        {project.start_date} - {project.end_date}
                                    </td>
                                    <td className="py-4 pr-2 text-right">
                                        <Link href={`/projects/${project.id}`} className="text-gray-400 hover:text-brand-white transition-colors">
                                            <ArrowRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
