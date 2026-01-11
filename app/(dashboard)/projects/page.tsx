'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProjects, Project } from '@/lib/data';
import { Calendar, ArrowRight, Filter } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProjects().then(data => {
            setProjects(data);
            setFilteredProjects(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.status === statusFilter));
        }
    }, [statusFilter, projects]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-brand-white">Projects</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and track your active campaigns.</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-white/10 text-gray-300 rounded-lg text-sm hover:text-white transition-colors"
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                    {showFilters && (
                        <div className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-primary/20 rounded-lg shadow-xl z-20 overflow-hidden">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded ${statusFilter === 'all' ? 'bg-brand-primary text-black font-medium' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    All Projects
                                </button>
                                <button
                                    onClick={() => { setStatusFilter('active'); setShowFilters(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded ${statusFilter === 'active' ? 'bg-brand-primary text-black font-medium' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    Active Only
                                </button>
                                <button
                                    onClick={() => { setStatusFilter('completed'); setShowFilters(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded ${statusFilter === 'completed' ? 'bg-brand-primary text-black font-medium' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => { setStatusFilter('paused'); setShowFilters(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded ${statusFilter === 'paused' ? 'bg-brand-primary text-black font-medium' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    Paused
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                        <div className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden hover:border-brand-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/5 h-full flex flex-col">
                            <div className="h-40 bg-gray-800 relative overflow-hidden">
                                <img src={project.thumbnail || ''} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3">
                                    <span className={`
                                    px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 shadow-sm capitalize
                                    ${project.status === 'active' ? 'bg-brand-primary/90 text-black' : 'bg-black/50 text-white'}
                                `}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-brand-white mb-2 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                                <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">{project.description}</p>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-brand-primary font-medium">{project.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary rounded-full" style={{ width: `${project.progress}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={14} />
                                            <span>{project.end_date}</span>
                                        </div>
                                        <span className="text-brand-primary/50 group-hover:translate-x-1 transition-transform">
                                            <ArrowRight size={18} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No projects found with the current filter.
                    </div>
                )}
            </div>
        </div>
    );
}
