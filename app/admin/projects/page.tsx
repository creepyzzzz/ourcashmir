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
        <div className="space-y-3 lg:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">Project Management</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Track progress, deadlines, and deliverables across all accounts.</p>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                    {isCreating ? (
                        <div className="flex flex-wrap items-center gap-2 bg-brand-surface p-2 rounded-lg border border-white/10">
                            <input
                                className="px-2 lg:px-3 py-1 bg-brand-dark rounded text-xs lg:text-sm outline-none w-24 lg:w-32"
                                placeholder="Project Title"
                                value={newProjectTitle}
                                onChange={e => setNewProjectTitle(e.target.value)}
                            />
                            <select
                                className="px-2 lg:px-3 py-1 bg-brand-dark rounded text-xs lg:text-sm outline-none w-24 lg:w-32"
                                value={selectedClientId}
                                onChange={e => setSelectedClientId(e.target.value)}
                            >
                                <option value="">Client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button onClick={handleCreateProject} className="text-green-500 font-bold text-xs p-1">SAVE</button>
                            <button onClick={() => setIsCreating(false)} className="text-red-500 font-bold text-xs p-1">X</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black rounded-lg text-xs lg:text-sm font-bold hover:bg-brand-secondary transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            Create Project
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl p-2.5 lg:p-4 flex flex-col sm:flex-row gap-2 lg:gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 sm:max-w-xs lg:max-w-sm">
                    <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-brand-dark border border-white/10 rounded-lg pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 text-xs lg:text-sm focus:border-brand-primary/50 outline-none transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                    <button className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 bg-brand-dark border border-white/10 rounded-lg text-[10px] lg:text-xs font-medium hover:border-brand-primary/30 transition-colors">
                        <Filter className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        Status
                    </button>
                    <button className="hidden sm:flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 bg-brand-dark border border-white/10 rounded-lg text-[10px] lg:text-xs font-medium hover:border-brand-primary/30 transition-colors">
                        <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        Date Range
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="group bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl overflow-hidden hover:border-brand-primary/20 transition-all">
                        {/* Thumbnail Header */}
                        <div className="h-20 lg:h-32 bg-gray-800 relative">
                            {project.thumbnail ? (
                                <img src={project.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            ) : (
                                <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center">
                                    <Briefcase className="text-brand-primary opacity-50 w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                            )}
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
                                <span className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-[9px] lg:text-xs font-medium
                                    ${project.status === 'active' ? 'bg-green-500 text-black' : ''}
                                    ${project.status === 'paused' ? 'bg-yellow-500 text-black' : ''}
                                    ${project.status === 'completed' ? 'bg-blue-500 text-white' : ''}
                                `}>
                                    {project.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 lg:p-5">
                            <div className="mb-3 lg:mb-4">
                                <h3 className="font-bold text-sm lg:text-lg text-white mb-0.5 lg:mb-1 group-hover:text-brand-primary transition-colors truncate">{project.title}</h3>
                                <p className="text-[10px] lg:text-xs text-gray-400 flex items-center gap-1">
                                    <Briefcase className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                                    {getClientName(project.client_id)}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3 lg:mb-4">
                                <div className="flex justify-between text-[9px] lg:text-xs mb-1 text-gray-400">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full h-1 lg:h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-white/5">
                                <div className="text-[9px] lg:text-xs text-gray-500">
                                    <span className="block text-gray-600 uppercase text-[8px] lg:text-[10px]">Deadline</span>
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No Deadline'}
                                </div>
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="px-2 lg:px-3 py-1 lg:py-1.5 bg-white/5 text-[10px] lg:text-xs font-medium text-white rounded hover:bg-brand-primary hover:text-black transition-colors"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !loading && (
                    <div className="col-span-full text-center p-6 lg:p-10 text-gray-500 text-xs lg:text-sm">
                        No projects found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
