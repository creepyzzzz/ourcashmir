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
    Briefcase,
    ChevronRight
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
    const [mobileView, setMobileView] = useState<string>('New'); // For mobile stage tabs

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

    const getStatusColor = (status: string) => {
        if (status === 'New' || status === 'new') return 'bg-blue-400';
        if (status === 'Contacted' || status === 'contacted') return 'bg-yellow-400';
        if (status === 'Qualified' || status === 'qualified') return 'bg-purple-400';
        return 'bg-green-400';
    };

    return (
        <div className="space-y-3 lg:space-y-6 h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center shrink-0">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight text-brand-white">Leads & CRM</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Track and manage potential client inquiries.</p>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-brand-surface border border-white/10 rounded-lg pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 text-xs lg:text-sm text-brand-white focus:outline-none focus:border-brand-primary/50 w-full lg:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black rounded-lg text-xs lg:text-sm font-bold hover:bg-brand-secondary transition-colors whitespace-nowrap"
                    >
                        <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Add</span> Lead
                    </button>
                </div>
            </div>

            {/* Mobile Stage Tabs */}
            <div className="lg:hidden flex gap-1 overflow-x-auto pb-1 shrink-0">
                {LEAD_STAGES.map((status) => {
                    const count = filteredLeads.filter(l => l.status.toLowerCase() === status.toLowerCase()).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setMobileView(status)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                                ${mobileView === status ? 'bg-brand-primary text-black' : 'bg-brand-surface border border-white/10 text-gray-400'}
                            `}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
                            {status}
                            <span className="bg-white/20 px-1 py-0.5 rounded text-[9px]">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden flex-1 overflow-y-auto space-y-2">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 text-xs"><Loader2 className="animate-spin mx-auto mb-2 w-4 h-4" />Loading...</div>
                ) : (
                    filteredLeads
                        .filter(l => l.status.toLowerCase() === mobileView.toLowerCase())
                        .map(lead => (
                            <div key={lead.id} className="bg-brand-surface border border-white/5 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{lead.company || 'Unknown Company'}</h4>
                                        <p className="text-xs text-gray-400">{lead.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                                        className="text-gray-500 p-1"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 text-[10px] text-gray-500 mb-2">
                                    {lead.email && (
                                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-brand-primary">
                                            <Mail className="w-3 h-3" /> {lead.email}
                                        </a>
                                    )}
                                    {lead.phone && (
                                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-brand-primary">
                                            <Phone className="w-3 h-3" /> {lead.phone}
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[9px] text-gray-600">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </span>
                                    {lead.status === 'qualified' && (
                                        <button
                                            onClick={() => handleConvertToClient(lead)}
                                            className="text-[9px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded hover:bg-brand-primary hover:text-black transition-colors"
                                        >
                                            Convert
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Action Menu */}
                                {activeMenu === lead.id && (
                                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                                        <button onClick={() => handleOpenModal(lead)} className="w-full text-left px-2 py-1.5 text-xs text-white hover:bg-white/5 rounded flex items-center gap-2">
                                            Edit Details
                                        </button>
                                        <button onClick={() => handleDelete(lead.id)} className="w-full text-left px-2 py-1.5 text-xs text-red-400 hover:bg-white/5 rounded flex items-center gap-2">
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                        <div className="pt-1 border-t border-white/5">
                                            <p className="px-2 py-1 text-[9px] text-gray-500 uppercase">Move To</p>
                                            {LEAD_STAGES.filter(s => s.toLowerCase() !== lead.status.toLowerCase()).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(lead, s.toLowerCase() as any)}
                                                    className="w-full text-left px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5 rounded flex items-center gap-2"
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(s)}`} />
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        {lead.status !== 'closed' && (
                                            <button onClick={() => handleConvertToClient(lead)} className="w-full text-left px-2 py-1.5 text-xs text-brand-primary font-bold hover:bg-white/5 rounded flex items-center gap-2">
                                                <Briefcase className="w-3 h-3" /> Convert to Client
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                )}
                {filteredLeads.filter(l => l.status.toLowerCase() === mobileView.toLowerCase()).length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 text-xs border-2 border-dashed border-white/5 rounded-lg">
                        No leads in this stage
                    </div>
                )}
            </div>

            {/* Desktop Kanban View */}
            <div className="hidden lg:flex flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-[1000px]">
                    {LEAD_STAGES.map((status) => (
                        <div key={status} className="flex-1 bg-brand-surface border border-brand-primary/5 rounded-xl flex flex-col min-w-[300px]">
                            {/* Column Header */}
                            <div className="p-4 border-b border-brand-primary/5 flex justify-between items-center bg-brand-dark/20 rounded-t-xl">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
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
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(s)}`} />
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
                            className="fixed left-1/2 top-1/2 w-[90%] max-w-lg bg-brand-surface border border-white/10 rounded-xl lg:rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-base lg:text-xl font-bold text-brand-white">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="space-y-1.5 lg:space-y-2">
                                        <label className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5 lg:space-y-2">
                                        <label className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase">Company</label>
                                        <input
                                            required
                                            value={formData.company || ''}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div className="pt-3 lg:pt-4 flex justify-end gap-2 lg:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 lg:px-6 py-1.5 lg:py-2 bg-brand-primary text-black text-xs lg:text-sm font-bold rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {saving && <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />}
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
