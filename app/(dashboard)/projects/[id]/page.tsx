'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProjects, Project, Task, ApprovalItem, fetchTasks } from '@/lib/data';
import { Calendar, CheckCircle, FileText, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [project, setProject] = useState<Project | null>(null);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id) {
            // Optimised in a real app to fetch single project by ID.
            fetchProjects().then(projects => {
                const found = projects.find(p => p.id === id) || null;
                setProject(found);
            });

            fetchTasks(id).then(tasks => setProjectTasks(tasks));
        }
    }, [id]);

    if (!project) return <div className="p-10 text-center text-gray-500">Loading details...</div>;

    const projectApprovals: ApprovalItem[] = []; // Placeholder

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-white mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium uppercase tracking-wide">
                            {project.status}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={14} /> {project.start_date} — {project.end_date}
                        </span>
                    </div>
                </div>
                <button className="px-4 py-2 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-secondary transition-colors text-sm">
                    Contact Manager
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-brand-primary/10">
                <nav className="flex gap-6">
                    {['overview', 'tasks', 'files', 'reports'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                pb-4 text-sm font-medium border-b-2 transition-colors capitalize
                                ${activeTab === tab
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-brand-white mb-4">Description</h3>
                                <p className="text-gray-400 leading-relaxed">{project.description}</p>
                            </div>

                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-brand-white mb-4">Pending Approvals</h3>
                                <div className="space-y-3">
                                    {projectApprovals.length > 0 ? projectApprovals.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 hover:border-brand-primary/20 bg-black/20 transition-colors">
                                            <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                                                <img src={a.thumbnail} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-brand-white font-medium text-sm">{a.title}</p>
                                                <p className="text-gray-500 text-xs">{a.type}</p>
                                            </div>
                                            <button className="text-xs text-brand-primary hover:underline">Review</button>
                                        </div>
                                    )) : <div className="text-gray-500 text-sm">No pending items.</div>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Completion</span>
                                            <span className="text-white">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary" style={{ width: `${project.progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-2 border-t border-white/5">
                                        <span className="text-gray-400">Tasks Completed</span>
                                        <span className="text-white font-medium">0 / 0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-2 border-t border-white/5">
                                        <span className="text-gray-400">Days Remaining</span>
                                        <span className="text-brand-primary font-medium">--</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Task</th>
                                    <th className="px-6 py-4 font-medium">Assignee</th>
                                    <th className="px-6 py-4 font-medium">Due Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projectTasks.length > 0 ? projectTasks.map((task) => (
                                    <tr key={task.id} className="text-sm hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium text-brand-white">{task.title}</td>
                                        <td className="px-6 py-4 text-gray-400">{task.assignee}</td>
                                        <td className="px-6 py-4 text-gray-400">{task.due_date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium border
                                                ${task.status === 'done' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                            `}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={4} className="p-6 text-center text-gray-500">No tasks found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {(activeTab === 'files' || activeTab === 'reports') && (
                    <div className="text-center py-20 bg-brand-surface border border-brand-primary/10 rounded-xl border-dashed">
                        <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300">No content uploaded yet</h3>
                        <p className="text-gray-500 text-sm mt-2">Files and reports will appear here once linked by your manager.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
