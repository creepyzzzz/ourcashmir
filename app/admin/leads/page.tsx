'use client';

import React, { useEffect, useState } from 'react';
import {
    Search,
    UserPlus,
    Mail,
    Phone,
    MoreHorizontal,
    Trash2,
    ArrowRightCircle,
    CheckCircle2,
    X,
    Loader2,
    Briefcase
} from 'lucide-react';
import {
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    convertLeadToClient,
    Lead
} from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';

const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Closed'];

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState<Partial<Lead>>({ name: '', company: '', email: '', phone: '', status: 'new' });
    const [saving, setSaving] = useState(false);

    // Dropdown / Menu State
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        setLoading(true);
        const data = await fetchLeads();
        setLeads(data);
        setLoading(false);
    };

    const handleOpenModal = (lead?: Lead) => {
        if (lead) {
            setEditingLead(lead);
            setFormData(lead);
        } else {
            setEditingLead(null);
            setFormData({ name: '', company: '', email: '', phone: '', status: 'new' });
        }
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingLead) {
                await updateLead(editingLead.id, formData);
            } else {
                await createLead(formData);
            }
            await loadLeads();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save lead');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            await deleteLead(id);
            setLeads(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleStatusChange = async (lead: Lead, newStatus: Lead['status']) => {
        try {
            // Optimistic update
            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
            await updateLead(lead.id, { status: newStatus });
        } catch (error) {
            loadLeads(); // Revert on error
            alert('Failed to update status');
        }
        setActiveMenu(null);
    };

    const handleConvertToClient = async (lead: Lead) => {
        if (!confirm(`Convert ${lead.name} to a Client? This will create a new client record and mark this lead as Closed.`)) return;
        try {
            await convertLeadToClient(lead);
            await loadLeads();
            alert('Lead converted to Client successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to convert lead');
        }
        setActiveMenu(null);
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-white">Leads & CRM</h1>
                    <p className="text-gray-400 text-sm mt-1">Track and manage potential client inquiries.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-brand-surface border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-primary/50 w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors"
                    >
                        <UserPlus size={16} />
                        Add Lead
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-[1000px]">
                    {LEAD_STAGES.map((status) => (
                        <div key={status} className="flex-1 bg-brand-surface border border-brand-primary/5 rounded-xl flex flex-col min-w-[300px]">
                            {/* Column Header */}
                            <div className="p-4 border-b border-brand-primary/5 flex justify-between items-center bg-brand-dark/20 rounded-t-xl">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-blue-400' :
                                        status === 'Contacted' ? 'bg-yellow-400' :
                                            status === 'Qualified' ? 'bg-purple-400' : 'bg-green-400'
                                        }`} />
                                    {status}
                                </h3>
                                <span className="bg-white/5 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">
                                    {filteredLeads.filter(l => l.status.toLowerCase() === status.toLowerCase()).length}
                                </span>
                            </div>

                            {/* Column Content */}
                            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                                {loading && status === 'New' ? (
                                    <div className="text-center py-10 text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" />Loading...</div>
                                ) : (
                                    filteredLeads
                                        .filter(l => l.status.toLowerCase() === status.toLowerCase())
                                        .map(lead => (
                                            <div key={lead.id} className="bg-brand-dark border border-white/5 p-4 rounded-xl hover:border-brand-primary/30 transition-all group relative shadow-sm hover:shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-brand-white text-sm">{lead.company || 'Unknown Company'}</h4>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                                                            className="text-gray-600 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                                                        >
                                                            <MoreHorizontal size={14} />
                                                        </button>

                                                        {/* Context Menu */}
                                                        {activeMenu === lead.id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setActiveMenu(null)}
                                                                />
                                                                <div className="absolute right-0 top-6 w-48 bg-brand-surface border border-white/10 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                                                                    <button onClick={() => handleOpenModal(lead)} className="w-full text-left px-4 py-2 text-xs text-brand-white hover:bg-white/5 flex items-center gap-2">
                                                                        Edit Details
                                                                    </button>
                                                                    <button onClick={() => handleDelete(lead.id)} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2">
                                                                        <Trash2 size={12} /> Delete Lead
                                                                    </button>
                                                                    <div className="h-px bg-white/10 my-1" />
                                                                    <p className="px-4 py-1 text-[10px] text-gray-500 uppercase font-semibold">Move To</p>
                                                                    {LEAD_STAGES.map(s => (
                                                                        s.toLowerCase() !== lead.status.toLowerCase() && (
                                                                            <button
                                                                                key={s}
                                                                                onClick={() => handleStatusChange(lead, s.toLowerCase() as any)}
                                                                                className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2"
                                                                            >
                                                                                {s === 'New' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                                                                {s === 'Contacted' && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                                                                                {s === 'Qualified' && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                                                                                {s === 'Closed' && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                                                                                {s}
                                                                            </button>
                                                                        )
                                                                    ))}
                                                                    {lead.status !== 'closed' && (
                                                                        <>
                                                                            <div className="h-px bg-white/10 my-1" />
                                                                            <button onClick={() => handleConvertToClient(lead)} className="w-full text-left px-4 py-2 text-xs text-brand-primary hover:bg-white/5 flex items-center gap-2 font-bold">
                                                                                <Briefcase size={12} /> Convert to Client
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-300 mb-3">{lead.name}</p>

                                                <div className="flex flex-col gap-1.5">
                                                    {lead.email && (
                                                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-primary transition-colors">
                                                            <Mail size={12} /> {lead.email}
                                                        </a>
                                                    )}
                                                    {lead.phone && (
                                                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-primary transition-colors">
                                                            <Phone size={12} /> {lead.phone}
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                                    <span className="text-[10px] text-gray-600">
                                                        Added {new Date(lead.created_at).toLocaleDateString()}
                                                    </span>
                                                    {lead.status === 'qualified' && (
                                                        <button
                                                            onClick={() => handleConvertToClient(lead)}
                                                            className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded hover:bg-brand-primary hover:text-black transition-colors"
                                                        >
                                                            Convert
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                )}
                                {filteredLeads.filter(l => l.status.toLowerCase() === status.toLowerCase()).length === 0 && !loading && (
                                    <div className="text-center py-8 opacity-50 border-2 border-dashed border-white/5 rounded-xl">
                                        <p className="text-xs text-gray-500">No leads</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            className="fixed left-1/2 top-1/2 w-full max-w-lg bg-brand-surface border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-brand-white">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Company</label>
                                        <input
                                            required
                                            value={formData.company || ''}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-brand-primary text-black text-sm font-bold rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {saving && <Loader2 size={14} className="animate-spin" />}
                                        {editingLead ? 'Save Changes' : 'Create Lead'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
