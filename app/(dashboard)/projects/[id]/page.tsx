'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProjects, Project, Task, ApprovalItem, fetchTasks, fetchProjectAssets, fetchReports, Report, updateTask } from '@/lib/data';
import { Calendar, CheckCircle, FileText, Clock, AlertCircle, Paperclip, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [project, setProject] = useState<Project | null>(null);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [assets, setAssets] = useState<ApprovalItem[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id) {
            // Optimised in a real app to fetch single project by ID.
            fetchProjects().then(projects => {
                const found = projects.find(p => p.id === id) || null;
                setProject(found);

                if (found && found.client_id) {
                    fetchReports(found.client_id).then(data => setReports(data));
                }
            });

            fetchTasks(id).then(tasks => setProjectTasks(tasks));
            fetchProjectAssets(id).then(data => setAssets(data));
        }
    }, [id]);

    const toggleTaskStatus = async (task: Task) => {
        const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
        try {
            await updateTask(task.id, { status: nextStatus });
            setProjectTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!project) return <div className="p-10 text-center text-gray-500">Loading details...</div>;

    const projectApprovals = assets.filter(a => a.status === 'pending');

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
                                            <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                                {a.thumbnail ? (
                                                    <img src={a.thumbnail} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/10 text-gray-500">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-brand-white font-medium text-sm truncate">{a.title}</p>
                                                <p className="text-gray-500 text-xs">{a.type}</p>
                                            </div>
                                            <Link href="/approvals" className="text-xs text-brand-primary hover:underline">Review</Link>
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
                                        <span className="text-white font-medium">{projectTasks.filter(t => t.status === 'done').length} / {projectTasks.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-2 border-t border-white/5">
                                        <span className="text-gray-400">Value</span>
                                        <span className="text-brand-primary font-medium">₹{project.value?.toLocaleString('en-IN') || 0}</span>
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
                                    <th className="px-6 py-4 font-medium">Priority</th>
                                    <th className="px-6 py-4 font-medium">Assignee</th>
                                    <th className="px-6 py-4 font-medium">Due Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projectTasks.length > 0 ? projectTasks.map((task) => (
                                    <tr key={task.id} className="text-sm hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-brand-white">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleTaskStatus(task)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors
                                                    ${task.status === 'done' ? 'bg-brand-primary border-brand-primary' :
                                                            task.status === 'in-progress' ? 'border-brand-primary text-brand-primary' : 'border-gray-600 hover:border-brand-primary'}
                                                `}>
                                                    {task.status === 'done' && <div className="w-2 h-2 bg-black rounded-[0.5px]" />}
                                                    {task.status === 'in-progress' && <div className="w-1 h-1 bg-brand-primary rounded-full" />}
                                                </button>
                                                <span className={task.status === 'done' ? 'text-gray-500 line-through' : ''}>{task.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wide
                                                ${task.priority === 'high' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                                                    task.priority === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                                        'text-blue-400 bg-blue-400/10 border-blue-400/20'}
                                             `}>
                                                {task.priority || 'medium'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300">
                                                    {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                {task.assignee || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-medium
                                                ${task.status === 'done' ? 'text-green-500 bg-green-500/10 border border-green-500/20' :
                                                    task.status === 'in-progress' ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20' :
                                                        'text-gray-400 bg-white/5 border border-white/10'}
                                            `}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={5} className="p-8 text-center text-gray-500">No tasks pending.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'files' && (
                    <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                        {assets.length === 0 ? (
                            <div className="text-center py-20 border border-white/5 rounded-xl border-dashed">
                                <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-300">No content uploaded yet</h3>
                                <p className="text-gray-500 text-sm mt-2">Files and reports will appear here once linked by your manager.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assets.map(asset => (
                                    <div key={asset.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden group hover:border-brand-primary/30 transition-colors">
                                        <div className="h-40 bg-gray-800 relative">
                                            {asset.thumbnail ? (
                                                <img src={asset.thumbnail} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500">
                                                    <Paperclip size={32} />
                                                </div>
                                            )}
                                            <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium uppercase shadow-sm
                                                ${asset.status === 'approved' ? 'bg-green-500 text-black' : ''}
                                                ${asset.status === 'rejected' ? 'bg-red-500 text-white' : ''}
                                                ${asset.status === 'pending' ? 'bg-yellow-500 text-black' : ''}
                                                ${asset.status === 'uploaded' ? 'bg-gray-500 text-white' : ''}
                                            `}>
                                                {asset.status}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white text-sm truncate pr-2" title={asset.title}>{asset.title}</h4>
                                                <span className="text-[10px] uppercase text-gray-500 font-medium bg-white/10 px-1.5 py-0.5 rounded">{asset.type}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4">
                                                Added {new Date(asset.created_at).toLocaleDateString()}
                                            </p>
                                            {asset.comments && (
                                                <div className="mb-4 p-2 bg-black/30 rounded text-xs text-gray-400 italic">
                                                    "{asset.comments}"
                                                </div>
                                            )}
                                            {asset.file_url && (
                                                <a
                                                    href={asset.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline"
                                                >
                                                    View Asset <ArrowRight size={12} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                        {reports.length === 0 ? (
                            <div className="text-center py-20 border border-white/5 rounded-xl border-dashed">
                                <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-300">No reports generated yet</h3>
                                <p className="text-gray-500 text-sm mt-2">Check back later for campaign performance reports.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map(report => (
                                    <div key={report.id} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
                                                <FileText size={24} />
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{report.title}</h3>
                                        <p className="text-xs text-gray-500 mb-4">{report.type}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                                            {report.download_url && (
                                                <a
                                                    href={report.download_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-brand-white hover:text-brand-primary flex items-center gap-1"
                                                >
                                                    <Download size={14} />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
