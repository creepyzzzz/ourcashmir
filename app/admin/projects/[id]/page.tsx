'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    MoreVertical,
    Calendar,
    CheckCircle2,
    Users,
    Paperclip,
    Plus,
    Clock,
    Edit,
    X,
    Save,
    Trash2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import {
    fetchProjectById,
    fetchTasks,
    fetchClientById,
    updateProject,
    deleteProject,
    createTask,
    updateTaskStatus,
    Project,
    Task,
    Client
} from '@/lib/data';

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Project>>({});

    // Task Create State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const loadData = async () => {
        const id = params?.id as string;
        if (!id) return;

        setLoading(true);
        try {
            const proj = await fetchProjectById(id);
            if (proj) {
                setProject(proj);
                setEditForm(proj);

                const [cli, tsk] = await Promise.all([
                    fetchClientById(proj.client_id),
                    fetchTasks(id)
                ]);
                setClient(cli);
                setTasks(tsk);
            } else {
                router.push('/admin/projects');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [params?.id, router]);

    const handleUpdateProject = async () => {
        if (!project || !editForm) return;
        try {
            await updateProject(project.id, {
                title: editForm.title,
                status: editForm.status,
                progress: editForm.progress,
                description: editForm.description,
                start_date: editForm.start_date,
                end_date: editForm.end_date,
                value: Number(editForm.value)
            });
            setIsEditing(false);
            loadData();
        } catch (error) {
            alert('Failed to update project');
        }
    };

    const handleDeleteProject = async () => {
        if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
        if (!project) return;
        try {
            await deleteProject(project.id);
            router.push('/admin/projects');
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim() || !project) return;
        try {
            await createTask({
                project_id: project.id,
                title: newTaskTitle,
                status: 'todo',
                assignee: 'Unassigned', // Placeholder
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
            setNewTaskTitle('');
            setIsAddingTask(false);
            // Refresh tasks
            const tsk = await fetchTasks(project.id);
            setTasks(tsk);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await updateTaskStatus(task.id, newStatus);
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading project details...</div>;
    if (!project) return <div className="p-10 text-center text-gray-500">Project not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'text-green-500 bg-green-500/10';
            case 'in-progress': return 'text-blue-500 bg-blue-500/10';
            case 'todo': return 'text-gray-400 bg-white/5';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div>
                <Link href="/admin/projects" className="flex items-center text-sm text-gray-500 hover:text-white mb-4 transition-colors">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Projects
                </Link>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border border-white/10
                                ${project.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
                                ${project.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
                                ${project.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                            `}>
                                {(project.status || 'unknown').toUpperCase()}
                            </span>
                        </div>
                        {client && (
                            <Link href={`/admin/clients/${client.id}`} className="text-sm text-brand-primary hover:underline">
                                {client.name} • {client.company || 'No Company'}
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-brand-surface border border-white/10 rounded-lg hover:bg-white/5 text-sm font-medium flex items-center gap-2"
                        >
                            <Edit size={14} /> Edit Project
                        </button>
                        <button
                            onClick={handleDeleteProject}
                            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-sm font-medium flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main: Tasks & Progress */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Card */}
                    <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-sm text-gray-400">Total Progress</p>
                                <p className="text-3xl font-bold text-white mt-1">{project.progress}%</p>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                                <p>Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</p>
                                <p>End: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-brand-dark/30">
                            <h3 className="font-bold text-sm">Tasks & Deliverables</h3>
                            <button
                                onClick={() => setIsAddingTask(!isAddingTask)}
                                className="text-brand-primary text-xs font-medium hover:underline flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Task
                            </button>
                        </div>

                        {isAddingTask && (
                            <div className="p-4 bg-white/5 border-b border-white/5 flex gap-2">
                                <input
                                    autoFocus
                                    className="flex-1 bg-brand-dark border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-brand-primary"
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                                />
                                <button onClick={handleAddTask} className="px-3 py-1 bg-brand-primary text-black text-xs font-bold rounded">Save</button>
                            </div>
                        )}

                        <div className="divide-y divide-white/5">
                            {tasks.length === 0 && !isAddingTask && (
                                <p className="p-8 text-center text-gray-500 text-sm">No tasks created yet.</p>
                            )}
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className="p-4 flex items-center justify-between group hover:bg-white/[0.02] cursor-pointer"
                                    onClick={() => toggleTaskStatus(task)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 text-black' : 'border border-gray-600 text-transparent hover:border-brand-primary'}`}>
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <p className={`text-sm ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                            {task.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-medium ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 w-24 justify-end">
                                            <Calendar size={12} />
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-gray-400">
                                            {task.assignee ? task.assignee.charAt(0) : '?'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Meta Info */}
                <div className="space-y-6">
                    <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                        <h3 className="font-bold text-sm mb-4">Project Details</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 whitespace-pre-wrap">
                            {project.description || 'No description provided.'}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="p-2 bg-white/5 rounded-lg text-gray-400">
                                    <Calendar size={16} />
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500">Timeline</p>
                                    <p className="text-gray-300">
                                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <span className="p-2 bg-white/5 rounded-lg text-gray-400">
                                    <Clock size={16} />
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500">Value</p>
                                    <p className="text-gray-300">₹{(project.value || 0).toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <span className="p-2 bg-white/5 rounded-lg text-gray-400">
                                    <Users size={16} />
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500">Team</p>
                                    <p className="text-gray-300">Unassigned</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AssetsSection projectId={project.id} clientId={project.client_id} />
                </div>
            </div>

            {/* Edit Project Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Edit Project</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Project Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Status</label>
                                    <select
                                        value={editForm.status || 'active'}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="paused">Paused</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Progress (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editForm.progress || 0}
                                        onChange={(e) => setEditForm({ ...editForm, progress: Number(e.target.value) })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Description</label>
                                <textarea
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none h-24 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={editForm.start_date ? editForm.start_date.split('T')[0] : ''}
                                        onChange={(e) => setEditForm({ ...editForm, start_date: new Date(e.target.value).toISOString() })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={editForm.end_date ? editForm.end_date.split('T')[0] : ''}
                                        onChange={(e) => setEditForm({ ...editForm, end_date: new Date(e.target.value).toISOString() })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Value (₹)</label>
                                <input
                                    type="number"
                                    value={editForm.value || 0}
                                    onChange={(e) => setEditForm({ ...editForm, value: Number(e.target.value) })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProject}
                                className="px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary flex items-center gap-2"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function AssetsSection({ projectId, clientId }: { projectId: string, clientId: string }) {
    const [assets, setAssets] = useState<any[]>([]);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);

    const [uploadForm, setUploadForm] = useState({
        title: '',
        file: null as File | null,
        url: '', // New field for URL
        type: 'image',
        requiresApproval: false
    });

    const loadAssets = async () => {
        const { fetchProjectAssets } = await import('@/lib/data');
        const data = await fetchProjectAssets(projectId);
        setAssets(data || []);
    };

    useEffect(() => {
        loadAssets();
    }, [projectId]);

    const handleUpload = async () => {
        // Validation based on active tab
        if (!uploadForm.title) return;
        if (activeTab === 'file' && !uploadForm.file) return;
        if (activeTab === 'url' && !uploadForm.url) return;

        setIsUploading(true);
        setUploadProgress(0);

        // Progress Simulation
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 300);

        try {
            const { createAsset, uploadFile } = await import('@/lib/data');

            let finalUrl = uploadForm.url;

            // If Text Tab, use the URL directly.
            // If File Tab, upload it first.
            if (activeTab === 'file' && uploadForm.file) {
                finalUrl = await uploadFile(uploadForm.file);
            }

            clearInterval(interval);
            setUploadProgress(100);

            // Small delay for UX
            await new Promise(r => setTimeout(r, 600));

            await createAsset({
                project_id: projectId,
                client_id: clientId,
                title: uploadForm.title,
                thumbnail: uploadForm.type === 'image' ? finalUrl : null,
                file_url: finalUrl,
                type: uploadForm.type,
                status: uploadForm.requiresApproval ? 'pending' : 'uploaded',
                submitted_date: new Date().toISOString()
            });

            setUploadForm({ title: '', file: null, url: '', type: 'image', requiresApproval: false });
            setIsUploading(false);
            setUploadProgress(0);
            loadAssets();
        } catch (error) {
            console.error(error);
            alert('Upload failed');
            setIsUploading(false);
            setUploadProgress(0);
        } finally {
            clearInterval(interval);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this asset?')) return;
        const { deleteAsset } = await import('@/lib/data');
        await deleteAsset(id);
        loadAssets();
    };

    // Derived logic
    const isModalOpen = isUploading === true; // Keep it simple, just use this flag for visibility
    const isSubmitting = uploadProgress > 0 && isUploading; // Check for actual progress to see if processing

    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadForm({ ...uploadForm, file: e.dataTransfer.files[0] });
        }
    };

    return (
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Files & Assets</h3>
                <button
                    onClick={() => {
                        setIsUploading(true);
                        setUploadProgress(0);
                        // Reset when opening
                        setUploadForm({ title: '', file: null, url: '', type: 'image', requiresApproval: false });
                    }}
                    className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                >
                    <Plus size={12} /> Upload
                </button>
            </div>

            {assets.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No files uploaded.</p>
            ) : (
                <div className="space-y-3">
                    {assets.map(asset => (
                        <div key={asset.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 group transition-colors">
                            <div className={`p-2 rounded ${asset.type === 'document' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                <Paperclip size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">{asset.title}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm 
                                        ${asset.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                                        ${asset.status === 'approved' ? 'bg-green-500/20 text-green-500' : ''}
                                        ${asset.status === 'rejected' ? 'bg-red-500/20 text-red-500' : ''}
                                        ${asset.status === 'uploaded' ? 'bg-gray-500/20 text-gray-400' : ''}
                                    `}>
                                        {asset.status === 'uploaded' ? 'Shared' : asset.status}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{new Date(asset.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={asset.file_url} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-brand-primary hover:bg-white/10 rounded">
                                    <ArrowRight size={12} className="-rotate-45" />
                                </a>
                                <button onClick={() => handleDelete(asset.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Upload Asset</h3>
                            {/* Only show Close if not submitting to prevent corrupt state */}
                            {!isSubmitting && (
                                <button onClick={() => setIsUploading(false)} className="text-gray-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {isSubmitting ? (
                            <div className="py-8 flex flex-col items-center justify-center space-y-6">
                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden relative">
                                    <div
                                        className="h-full bg-brand-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,255,128,0.5)]"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-white">{Math.round(uploadProgress)}%</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">{activeTab === 'file' ? 'Uploading File...' : 'Saving...'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-primary transition-colors placeholder:text-gray-600"
                                    placeholder="Enter asset title..."
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                />

                                {/* Tabs */}
                                <div className="flex bg-brand-dark rounded-lg p-1 border border-white/5">
                                    <button
                                        onClick={() => setActiveTab('file')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'file' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Paperclip size={14} /> File Upload
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('url')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'url' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <ArrowRight size={14} className="-rotate-45" /> External URL
                                    </button>
                                </div>

                                {activeTab === 'file' ? (
                                    <div
                                        className={`
                                            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative
                                            ${isDragOver ? 'border-brand-primary bg-brand-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                        `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={e => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                                        />

                                        {uploadForm.file ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <p className="text-sm font-medium text-white max-w-[200px] truncate">{uploadForm.file.name}</p>
                                                <p className="text-xs text-brand-primary mt-1">Ready to upload</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-2">
                                                    <Paperclip size={20} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-300">Click to upload or drag & drop</p>
                                                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-primary transition-colors placeholder:text-gray-600"
                                            placeholder="https://drive.google.com/..."
                                            value={uploadForm.url}
                                            onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })}
                                        />
                                        <ArrowRight size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 -rotate-45" />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none text-gray-200"
                                        value={uploadForm.type}
                                        onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                                    >
                                        <option value="image">Image</option>
                                        <option value="document">Document</option>
                                        <option value="video">Video</option>
                                        <option value="zip">Archive</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer p-3 border border-brand-primary/20 bg-brand-primary/5 rounded-lg hover:bg-brand-primary/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="accent-brand-primary w-4 h-4"
                                        checked={uploadForm.requiresApproval}
                                        onChange={e => setUploadForm({ ...uploadForm, requiresApproval: e.target.checked })}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-brand-white leading-none">Request Client Approval</span>
                                        <span className="text-[10px] text-gray-400 mt-1">Item will be pending until approved</span>
                                    </div>
                                </label>

                                <div className="flex justify-end gap-2 mt-6 pt-2">
                                    <button
                                        onClick={() => setIsUploading(false)}
                                        className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!uploadForm.title || (activeTab === 'file' && !uploadForm.file) || (activeTab === 'url' && !uploadForm.url)}
                                        className="px-4 py-2 bg-brand-primary text-black text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-secondary transition-colors"
                                    >
                                        {activeTab === 'file' ? 'Upload Asset' : 'Save Link'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
