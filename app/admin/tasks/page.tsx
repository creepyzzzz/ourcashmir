
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, ListFilter, Calendar, Filter, X, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask, fetchProjects, Task, Project } from '@/lib/data';

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task>>({
        title: '',
        project_id: '',
        assignee: '',
        due_date: '',
        priority: 'medium',
        status: 'todo'
    });

    const loadData = async () => {
        setLoading(true);
        const [tasksData, projectsData] = await Promise.all([
            fetchTasks(),
            fetchProjects()
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenCreate = () => {
        setIsEditing(false);
        setCurrentTask({
            title: '',
            project_id: projects.length > 0 ? projects[0].id : '',
            assignee: '',
            due_date: '',
            priority: 'medium',
            status: 'todo'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (task: Task) => {
        setIsEditing(true);
        setCurrentTask({ ...task });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!currentTask.title || !currentTask.project_id) {
            alert('Please fill in required fields (Title, Project)');
            return;
        }

        try {
            if (isEditing && currentTask.id) {
                await updateTask(currentTask.id, currentTask);
            } else {
                await createTask(currentTask);
            }
            setIsModalOpen(false);
            loadData(); // Refresh list to get relationships/updates
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                setTasks(prev => prev.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const toggleStatus = async (task: Task) => {
        const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
        try {
            await updateTask(task.id, { status: nextStatus });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getPriorityColor = (p?: string) => {
        if (p === 'high') return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (p === 'medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    if (loading) return <div className="p-4 lg:p-10 text-center text-gray-500 text-xs lg:text-base">Loading tasks...</div>;

    return (
        <div className="space-y-3 lg:space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">Task Management</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Track deliverables across all projects.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black rounded-lg text-xs lg:text-sm font-bold hover:bg-brand-secondary transition-colors w-full sm:w-auto"
                >
                    <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    New Task
                </button>
            </div>

            <div className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl overflow-hidden">
                {/* Local Filters */}
                <div className="p-2.5 lg:p-4 border-b border-white/5">
                    <div className="relative max-w-xs lg:max-w-sm">
                        <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            className="w-full bg-brand-dark border border-white/10 rounded-lg pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 text-xs lg:text-sm outline-none focus:border-brand-primary/40"
                        />
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {tasks.map(task => (
                        <div key={task.id} className="p-2.5 lg:p-4 flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4 hover:bg-white/[0.02] group transition-colors">
                            {/* Left side - checkbox and title */}
                            <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                                <button
                                    onClick={() => toggleStatus(task)}
                                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded border flex items-center justify-center transition-colors shrink-0
                                    ${task.status === 'done' ? 'bg-brand-primary border-brand-primary' :
                                            task.status === 'in-progress' ? 'border-brand-primary text-brand-primary' : 'border-gray-600 hover:border-brand-primary'}
                                `}>
                                    {task.status === 'done' && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-black rounded-[1px]" />}
                                    {task.status === 'in-progress' && <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-brand-primary rounded-full" />}
                                </button>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs lg:text-sm font-medium truncate ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </p>
                                    <p className="text-[10px] lg:text-xs text-gray-500 flex items-center gap-1.5 lg:gap-2 mt-0.5">
                                        <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                        <span className="truncate">{task.projects?.title || 'Unknown'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right side - metadata and actions */}
                            <div className="flex items-center gap-2 lg:gap-6 ml-6 sm:ml-0">
                                {/* Priority Badge */}
                                <span className={`text-[8px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 rounded border uppercase font-bold tracking-wide ${getPriorityColor(task.priority)}`}>
                                    {task.priority || 'low'}
                                </span>

                                {/* Assignee - hidden on mobile */}
                                <div className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-gray-400 w-24 lg:w-32 justify-end">
                                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] lg:text-xs font-bold uppercase">
                                        {task.assignee ? task.assignee.charAt(0) : '?'}
                                    </div>
                                    <span className="truncate">{task.assignee || 'Unassigned'}</span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-1 lg:gap-2 text-[10px] lg:text-xs text-gray-500 w-16 lg:w-24 justify-end">
                                    <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5 hidden sm:block" />
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-0.5 lg:gap-2">
                                    <button onClick={() => handleOpenEdit(task)} className="p-1 lg:p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(task.id)} className="p-1 lg:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm">
                            No tasks found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 lg:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-md p-4 lg:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4 lg:mb-6">
                            <h3 className="font-bold text-base lg:text-lg">{isEditing ? 'Edit Task' : 'New Task'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            <div>
                                <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Task Title</label>
                                <input
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary"
                                    value={currentTask.title}
                                    onChange={e => setCurrentTask({ ...currentTask, title: e.target.value })}
                                    placeholder="e.g. Design Homepage"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Project</label>
                                <select
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                    value={currentTask.project_id}
                                    onChange={e => setCurrentTask({ ...currentTask, project_id: e.target.value })}
                                >
                                    <option value="" disabled>Select Project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Assignee</label>
                                    <input
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary"
                                        value={currentTask.assignee || ''}
                                        onChange={e => setCurrentTask({ ...currentTask, assignee: e.target.value })}
                                        placeholder="Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                        value={currentTask.due_date ? new Date(currentTask.due_date).toISOString().split('T')[0] : ''}
                                        onChange={e => setCurrentTask({ ...currentTask, due_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Priority</label>
                                    <select
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                        value={currentTask.priority || 'medium'}
                                        onChange={e => setCurrentTask({ ...currentTask, priority: e.target.value as any })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Status</label>
                                    <select
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                        value={currentTask.status}
                                        onChange={e => setCurrentTask({ ...currentTask, status: e.target.value as any })}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 lg:gap-3 mt-5 lg:mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black text-xs lg:text-sm font-bold rounded-lg hover:bg-brand-secondary transition-colors"
                            >
                                {isEditing ? 'Save Changes' : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
