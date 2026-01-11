
'use client';

import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { fetchLeads, createLead, Lead } from '@/lib/data';

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newLeadName, setNewLeadName] = useState('');
    const [newLeadCompany, setNewLeadCompany] = useState('');

    const loadLeads = async () => {
        setLoading(true);
        const data = await fetchLeads();
        setLeads(data);
        setLoading(false);
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleCreateLead = async () => {
        if (!newLeadName || !newLeadCompany) return;

        await createLead({
            name: newLeadName,
            company: newLeadCompany,
            status: 'new',
            email: '', // Could add input
            phone: ''
        });

        setNewLeadName('');
        setNewLeadCompany('');
        setIsCreating(false);
        loadLeads();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads & CRM</h1>
                    <p className="text-gray-400 text-sm mt-1">Track and manage potential client inquiries.</p>
                </div>
                {isCreating ? (
                    <div className="flex items-center gap-2 bg-brand-surface p-2 rounded-lg border border-white/10">
                        <input
                            className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-32"
                            placeholder="Name"
                            value={newLeadName}
                            onChange={e => setNewLeadName(e.target.value)}
                        />
                        <input
                            className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-32"
                            placeholder="Company"
                            value={newLeadCompany}
                            onChange={e => setNewLeadCompany(e.target.value)}
                        />
                        <button onClick={handleCreateLead} className="text-green-500 font-bold px-2">Save</button>
                        <button onClick={() => setIsCreating(false)} className="text-red-500 px-2">X</button>
                    </div>
                ) : (
                    <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
                        <UserPlus size={16} />
                        Add Lead
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
                {/* Pipeline Columns */}
                {['New', 'Contacted', 'Qualified', 'Closed'].map((status) => (
                    <div key={status} className="bg-brand-surface border border-white/5 rounded-xl flex flex-col">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-brand-dark/30">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">{status}</h3>
                            <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">
                                {leads.filter(l => l.status.toLowerCase() === status.toLowerCase()).length}
                            </span>
                        </div>
                        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                            {leads.filter(l => l.status.toLowerCase() === status.toLowerCase()).map(lead => (
                                <div key={lead.id} className="bg-brand-dark border border-white/5 p-4 rounded-lg hover:border-brand-primary/30 transition-all cursor-grab active:cursor-grabbing group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-sm">{lead.company}</h4>
                                        <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium mb-1">{lead.name}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <a href={`mailto:${lead.email}`} className="text-gray-500 hover:text-brand-primary transition-colors">
                                            <Mail size={14} />
                                        </a>
                                        <span className="text-[10px] text-gray-600 ml-auto">
                                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {leads.length === 0 && !loading && status === 'New' && (
                                <p className="text-xs text-center text-gray-500 mt-5">No leads in pipeline.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
