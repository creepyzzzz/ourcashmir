'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    FileText,
    CreditCard,
    Edit,
    X,
    Save
} from 'lucide-react';
import Link from 'next/link';
import { fetchClientById, fetchProjects, fetchInvoices, fetchReports, updateClient, Client, Project, Invoice, Report } from '@/lib/data';

export default function ClientDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        email: '',
        phone: '',
        status: '',
        account_manager: '',
        company: '',
        total_spent: 0
    });

    const loadData = async () => {
        const id = params?.id as string;
        if (!id) return;

        setLoading(true);
        try {
            const [clientData, projectsData, invoicesData, reportsData] = await Promise.all([
                fetchClientById(id),
                fetchProjects(id),
                fetchInvoices(id),
                fetchReports(id)
            ]);

            if (clientData) {
                setClient(clientData);
            } else {
                router.push('/admin/clients');
            }
            setProjects(projectsData || []);
            setInvoices(invoicesData || []);
            setReports(reportsData || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [params?.id, router]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsMenuOpen(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (client) {
            setEditForm({
                email: client.email || '',
                phone: client.phone || '',
                status: client.status,
                account_manager: client.account_manager || '',
                company: client.company || '',
                total_spent: client.total_spent || 0
            });
            setIsEditing(true);
            setIsMenuOpen(false);
        }
    };

    const handleSaveClient = async () => {
        if (!client) return;

        try {
            await updateClient(client.id, {
                email: editForm.email,
                phone: editForm.phone,
                status: editForm.status as 'active' | 'paused' | 'lead',
                account_manager: editForm.account_manager,
                company: editForm.company,
                total_spent: Number(editForm.total_spent)
            });

            setIsEditing(false);
            loadData(); // Re-fetch to update UI
        } catch (error) {
            console.error('Failed to update client', error);
            alert('Failed to update client');
        }
    };


    if (loading) return <div className="p-10 text-center text-gray-500">Loading client details...</div>;
    if (!client) return <div className="p-10 text-center text-gray-500">Client not found</div>;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'projects', label: 'Projects' },
        { id: 'invoices', label: 'Invoices & Billing' },
        { id: 'reports', label: 'Reports' },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Header / Nav */}
            <div>
                <Link href="/admin/clients" className="flex items-center text-sm text-gray-500 hover:text-white mb-4 transition-colors">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Clients
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-primary/20 overflow-hidden flex items-center justify-center text-2xl font-bold text-brand-primary">
                            {client.avatar_url ? (
                                <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                client.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-400">{client.company || 'No Company'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                    ${client.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
                                    ${client.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                    ${client.status === 'lead' ? 'bg-blue-500/10 text-blue-500' : ''}
                                `}>
                                    {client.status ? client.status.toUpperCase() : 'UNKNOWN'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-brand-surface border border-white/10 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={handleEditClick}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <Edit size={14} /> Edit Client Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/5 flex gap-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap
                            ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Stats & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-brand-surface border border-white/5 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                                <p className="text-xl font-bold text-white mt-1">₹{(client.total_spent || 0).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-brand-surface border border-white/5 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Active Projects</p>
                                <p className="text-xl font-bold text-white mt-1">{projects.filter(p => p.status === 'active').length}</p>
                            </div>
                            <div className="bg-brand-surface border border-white/5 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Invoices Paid</p>
                                <p className="text-xl font-bold text-white mt-1">{invoices.filter(i => i.status === 'paid').length}</p>
                            </div>
                        </div>

                        {/* Recent Projects List - Mini */}
                        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Briefcase size={18} className="text-brand-primary" />
                                Active Projects
                            </h3>
                            <div className="space-y-4">
                                {projects.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No projects found.</p>
                                ) : (
                                    projects.slice(0, 3).map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-3 border border-white/5 rounded-lg hover:border-brand-primary/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex items-center justify-center text-gray-500 text-xs">
                                                    {p.thumbnail ? (
                                                        <img src={p.thumbnail} className="w-full h-full object-cover" />
                                                    ) : (
                                                        'IMG'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{p.title}</p>
                                                    <p className="text-xs text-gray-500">Due {p.end_date ? new Date(p.end_date).toLocaleDateString() : 'TBD'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full 
                                                ${p.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
                                                ${p.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
                                                ${p.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            `}>
                                                {p.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                            <h3 className="font-bold mb-4">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                        <Mail size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="truncate" title={client.email || ''}>{client.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                        <p>{client.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Client Since</p>
                                        <p>{client.joined_date ? new Date(client.joined_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5 my-6" />

                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Account Manager</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs">
                                    {client.account_manager ? client.account_manager.charAt(0) : '?'}
                                </div>
                                <p className="text-sm font-medium">{client.account_manager || 'Unassigned'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {activeTab === 'projects' && (
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">All Projects</h3>
                        <Link href={`/admin/projects?create=true&client_id=${client.id}`} className="px-3 py-1.5 bg-brand-primary text-black text-xs font-bold rounded-lg hover:bg-brand-secondary transition-colors">
                            + New Project
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.length === 0 ? (
                            <p className="text-gray-500 text-sm col-span-full py-10 text-center">No projects for this client yet.</p>
                        ) : (
                            projects.map(p => (
                                <Link href={`/admin/projects/${p.id}`} key={p.id} className="block group">
                                    <div className="border border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/30 transition-all bg-brand-dark/50 p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="w-10 h-10 rounded bg-gray-800 mb-2 flex items-center justify-center text-xs">
                                                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : 'IMG'}
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full 
                                                ${p.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
                                                ${p.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
                                            `}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-brand-white group-hover:text-brand-primary transition-colors">{p.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description || 'No description'}</p>
                                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-gray-400">
                                            <span>Val: ₹{(p.value || 0).toLocaleString('en-IN')}</span>
                                            <span>Due: {p.end_date ? new Date(p.end_date).toLocaleDateString() : '-'}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Invoices</h3>
                        <Link href={`/admin/billing?create=true&client_id=${client.id}`} className="px-3 py-1.5 bg-brand-primary text-black text-xs font-bold rounded-lg hover:bg-brand-secondary transition-colors">
                            + Create Invoice
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400 text-xs uppercase">
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.length === 0 ? (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No invoices found.</td></tr>
                                ) : (
                                    invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium">{inv.description || `Invoice #${inv.id.slice(0, 6)}`}</td>
                                            <td className="px-4 py-3 text-sm text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm">₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                                    ${inv.status === 'paid' ? 'bg-green-500/10 text-green-500' : ''}
                                                    ${inv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                    ${inv.status === 'overdue' ? 'bg-red-500/10 text-red-500' : ''}
                                                `}>
                                                    {inv.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-6">Reports & Files</h3>
                    <div className="space-y-3">
                        {reports.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-10">No reports generated for this client.</p>
                        ) : (
                            reports.map(rep => (
                                <div key={rep.id} className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-brand-dark/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-brand-white">{rep.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(rep.created_at).toLocaleDateString()} • {rep.type}</p>
                                        </div>
                                    </div>
                                    <a href={rep.download_url || '#'} target="_blank" className="text-sm text-brand-primary hover:underline">
                                        Download
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Edit Client</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Company</label>
                                <input
                                    type="text"
                                    value={editForm.company}
                                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    >
                                        <option value="lead">Lead</option>
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Total Spent (₹)</label>
                                    <input
                                        type="number"
                                        value={editForm.total_spent}
                                        onChange={(e) => setEditForm({ ...editForm, total_spent: Number(e.target.value) })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Account Manager</label>
                                <input
                                    type="text"
                                    value={editForm.account_manager}
                                    onChange={(e) => setEditForm({ ...editForm, account_manager: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveClient}
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
