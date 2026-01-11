'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Download, Trash2, Edit, X, Save } from 'lucide-react';
import Link from 'next/link';
import { fetchClients, addNewClient, deleteClient, updateClient, Client } from '@/lib/data';

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'lead'>('all');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Edit Modal State
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editForm, setEditForm] = useState({
        status: '',
        account_manager: '',
        total_spent: 0
    });

    const loadClients = async () => {
        setLoading(true);
        const data = await fetchClients();
        setClients(data);
        setLoading(false);
    };

    useEffect(() => {
        loadClients();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleAddClient = async () => {
        if (!newClientName.trim()) return;
        setIsCreating(true);
        const { data, error } = await addNewClient({
            name: newClientName,
            status: 'lead',
            total_spent: 0,
            joined_date: new Date().toISOString().split('T')[0]
        });

        if (data) {
            setNewClientName('');
            loadClients();
        } else {
            alert('Failed to create client');
        }
        setIsCreating(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            await deleteClient(id);
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete client');
        }
    };

    const handleEditClick = (client: Client, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingClient(client);
        setEditForm({
            status: client.status,
            account_manager: client.account_manager || '',
            total_spent: client.total_spent || 0
        });
        setOpenMenuId(null);
    };

    const handleUpdateClient = async () => {
        if (!editingClient) return;

        try {
            await updateClient(editingClient.id, {
                status: editForm.status as 'active' | 'paused' | 'lead',
                account_manager: editForm.account_manager,
                total_spent: Number(editForm.total_spent)
            });

            setEditingClient(null);
            loadClients(); // Reload to get fresh data
        } catch (error) {
            console.error('Failed to update client', error);
            alert('Failed to update client');
        }
    };

    const handleExport = () => {
        const headers = ['Name', 'Company', 'Email', 'Status', 'Total Spent'];
        const rows = clients.map(c => [
            c.name,
            c.company || '',
            c.email || '',
            c.status,
            c.total_spent
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "clients_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const cycleFilter = () => {
        const states: ('all' | 'active' | 'paused' | 'lead')[] = ['all', 'active', 'paused', 'lead'];
        const currentIndex = states.indexOf(statusFilter);
        setStatusFilter(states[(currentIndex + 1) % states.length]);
    };

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 relative">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your client roster, contracts, and status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        <Download size={16} />
                        Export
                    </button>
                    <div className="flex items-center gap-2">
                        {isCreating ? (
                            <input
                                autoFocus
                                className="px-3 py-2 bg-brand-dark border border-brand-primary rounded-lg text-sm outline-none"
                                placeholder="Client Name..."
                                value={newClientName}
                                onClick={(e) => e.stopPropagation()}
                                onChange={e => setNewClientName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddClient()}
                                onBlur={() => !newClientName && setIsCreating(false)}
                            />
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsCreating(true); }}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors"
                            >
                                <Plus size={16} />
                                Add Client
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-brand-surface border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search clients by name, company..."
                        className="w-full bg-brand-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-brand-primary/50 outline-none transition-colors"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={cycleFilter}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors
                            ${statusFilter === 'all' ? 'bg-brand-dark border-white/10' : 'bg-brand-primary/10 border-brand-primary text-brand-primary'}
                        `}
                    >
                        <Filter size={14} />
                        Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </button>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-brand-surface border border-white/5 rounded-xl min-h-[400px]">
                <div className="overflow-x-auto pb-20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-brand-dark/30">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client / Company</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acct. Manager</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading clients...</td></tr>
                            ) : filteredClients.map((client) => (
                                <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors relative">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 overflow-hidden flex items-center justify-center text-brand-primary font-bold">
                                                {client.avatar_url ? (
                                                    <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    client.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-brand-white">{client.name}</p>
                                                <p className="text-xs text-brand-primary/80 mb-0.5">{client.email || ''}</p>
                                                <p className="text-xs text-gray-500">{client.company || 'No Company'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 
                                            ${client.status === 'active' ? 'bg-green-500 text-green-500' : ''}
                                            ${client.status === 'paused' ? 'bg-yellow-500 text-yellow-500' : ''}
                                            ${client.status === 'lead' ? 'bg-blue-500 text-blue-500' : ''}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                                                ${client.status === 'active' ? 'bg-green-500' : ''}
                                                ${client.status === 'paused' ? 'bg-yellow-500' : ''}
                                                ${client.status === 'lead' ? 'bg-blue-500' : ''}
                                            `} />
                                            {client.status ? (client.status.charAt(0).toUpperCase() + client.status.slice(1)) : 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">{client.account_manager || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-medium text-brand-white">
                                            ₹{(client.total_spent || 0).toLocaleString('en-IN')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <Link
                                                href={`/admin/clients/${client.id}`}
                                                className="hover:text-brand-primary text-sm font-medium mr-2"
                                            >
                                                View
                                            </Link>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === client.id ? null : client.id);
                                                    }}
                                                    className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                {openMenuId === client.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-brand-surface border border-white/10 rounded-lg shadow-xl z-50 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-200">
                                                        <button
                                                            onClick={(e) => handleEditClick(client, e)}
                                                            className="px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <Edit size={14} /> Edit Client
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(client.id, e)}
                                                            className="px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} /> Delete Client
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No clients found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Client Modal */}
            {editingClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Edit Client</h3>
                            <button onClick={() => setEditingClient(null)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Client Name</label>
                                <input
                                    type="text"
                                    value={editingClient.name}
                                    disabled
                                    className="w-full bg-brand-dark/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>

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
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Account Manager</label>
                                <input
                                    type="text"
                                    value={editForm.account_manager}
                                    onChange={(e) => setEditForm({ ...editForm, account_manager: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
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

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setEditingClient(null)}
                                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateClient}
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
