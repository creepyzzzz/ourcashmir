
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, ListFilter, Calendar, Filter } from 'lucide-react';

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        setTasks([]);
    }, []);

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (p === 'medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Track deliverables across all projects.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
                    <Plus size={16} />
                    New Task
                </button>
            </div>

            {/* Kanban-ish Board / List Switcher (List for now) */}
            <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
                {/* Local Filters */}
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            className="w-full bg-brand-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-primary/40"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10">
                            <ListFilter size={16} />
                            <span>Sprint View</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10">
                            <Filter size={16} />
                            <span>Assignee</span>
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {tasks.map(task => (
                        <div key={task.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] group transition-colors">
                            <div className="flex items-center gap-4">
                                <button className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                    ${task.status === 'done' ? 'bg-brand-primary border-brand-primary' : 'border-gray-600 hover:border-brand-primary'}
                                `}>
                                    {task.status === 'done' && <div className="w-2.5 h-2.5 bg-black rounded-[1px]" />}
                                </button>
                                <div>
                                    <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                        <span className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                        Project ID: {task.projectId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Priority Badge */}
                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wide ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>

                                {/* Assignee */}
                                <div className="flex items-center gap-2 text-sm text-gray-400 w-32 justify-end">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                        {task.assignee.charAt(0)}
                                    </div>
                                    <span className="truncate">{task.assignee}</span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 w-24 justify-end">
                                    <Calendar size={14} />
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No tasks found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
