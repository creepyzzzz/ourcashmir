'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchProjects, createProject, fetchClients, Project, Client } from '@/lib/data';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');

    const searchParams = useSearchParams();

    const loadData = async () => {
        setLoading(true);
        const [projData, clientData] = await Promise.all([fetchProjects(), fetchClients()]);
        setProjects(projData);
        setClients(clientData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const createParam = searchParams.get('create');
        const clientIdParam = searchParams.get('client_id');

        if (createParam === 'true') {
            setIsCreating(true);
        }
        if (clientIdParam) {
            setSelectedClientId(clientIdParam);
        }
    }, [searchParams]);

    const handleCreateProject = async () => {
        if (!newProjectTitle.trim() || !selectedClientId) {
            alert('Please enter a title and select a client');
            return;
        }

        const { data, error } = await createProject({
            title: newProjectTitle,
            client_id: selectedClientId,
            status: 'active',
            progress: 0,
            thumbnail: '', // Placeholder
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days default
        });

        if (data) {
            setNewProjectTitle('');
            setIsCreating(false);
            loadData();
        } else {
            console.error(error);
            alert('Failed to create project');
        }
    };

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Track progress, deadlines, and deliverables across all accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    {isCreating ? (
                        <div className="flex items-center gap-2 bg-brand-surface p-2 rounded-lg border border-white/10">
                            <input
                                className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-32"
                                placeholder="Project Title"
                                value={newProjectTitle}
                                onChange={e => setNewProjectTitle(e.target.value)}
                            />
                            <select
                                className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-32"
                                value={selectedClientId}
                                onChange={e => setSelectedClientId(e.target.value)}
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button onClick={handleCreateProject} className="text-green-500 font-bold text-xs p-1">SAVE</button>
                            <button onClick={() => setIsCreating(false)} className="text-red-500 font-bold text-xs p-1">X</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors"
                        >
                            <Plus size={16} />
                            Create Project
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-brand-surface border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-brand-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-brand-primary/50 outline-none transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2 bg-brand-dark border border-white/10 rounded-lg text-xs font-medium hover:border-brand-primary/30 transition-colors">
                        <Filter size={14} />
                        Status
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-brand-dark border border-white/10 rounded-lg text-xs font-medium hover:border-brand-primary/30 transition-colors">
                        <Calendar size={14} />
                        Date Range
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="group bg-brand-surface border border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/20 transition-all">
                        {/* Thumbnail Header */}
                        <div className="h-32 bg-gray-800 relative">
                            {project.thumbnail ? (
                                <img src={project.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            ) : (
                                <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center">
                                    <Briefcase className="text-brand-primary opacity-50" size={32} />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                    ${project.status === 'active' ? 'bg-green-500 text-black' : ''}
                                    ${project.status === 'paused' ? 'bg-yellow-500 text-black' : ''}
                                    ${project.status === 'completed' ? 'bg-blue-500 text-white' : ''}
                                `}>
                                    {project.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Briefcase size={12} />
                                    {getClientName(project.client_id)}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1 text-gray-400">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-xs text-gray-500">
                                    <span className="block text-gray-600 uppercase text-[10px]">Deadline</span>
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No Deadline'}
                                </div>
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="px-3 py-1.5 bg-white/5 text-xs font-medium text-white rounded hover:bg-brand-primary hover:text-black transition-colors"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !loading && (
                    <div className="col-span-full text-center p-10 text-gray-500">
                        No projects found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
