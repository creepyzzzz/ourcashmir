'use client';

import React, { useEffect, useState } from 'react';
import { Download, Plus, Search, DollarSign, CreditCard, Edit, Trash2, X, Save, Eye } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice, fetchClients, Invoice, Client } from '@/lib/data';
import InvoiceModal from '@/components/dashboard/InvoiceModal';

export default function AdminBillingPage() {
    const [invoices, setInvoices] = useState<any[]>([]); // Using any for join result
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newInvoiceAmount, setNewInvoiceAmount] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');

    // Edit State
    const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        amount: 0,
        status: 'pending'
    });

    // Preview State
    const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const searchParams = useSearchParams();

    const loadData = async () => {
        setLoading(true);
        const [invData, clientData] = await Promise.all([fetchInvoices(), fetchClients()]);
        setInvoices(invData || []);
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

    const handleCreateInvoice = async () => {
        if (!newInvoiceAmount || !selectedClientId) return;

        await createInvoice({
            client_id: selectedClientId,
            amount: parseFloat(newInvoiceAmount),
            status: 'pending',
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // +14 days
        });

        setNewInvoiceAmount('');
        setIsCreating(false);
        loadData();
    };

    const handleEditClick = (invoice: any) => {
        setEditingInvoice(invoice);
        setEditForm({
            amount: invoice.amount,
            status: invoice.status
        });
    };

    const handleUpdateInvoice = async () => {
        if (!editingInvoice) return;

        try {
            await updateInvoice(editingInvoice.id, {
                amount: editForm.amount,
                status: editForm.status as 'paid' | 'pending' | 'overdue'
            });
            setEditingInvoice(null);
            loadData();
        } catch (error) {
            alert('Failed to update invoice');
        }
    };

    const handleDeleteInvoice = async (id: string) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await deleteInvoice(id);
            setInvoices(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            alert('Failed to delete invoice');
        }
    };

    const handlePreviewClick = (invoice: any) => {
        setPreviewInvoice(invoice);
        setIsPreviewOpen(true);
    };

    const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    const pendingAmount = invoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    const overdueAmount = invoices
        .filter(i => i.status === 'overdue')
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Billing & Invoices</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage payments, invoices, and financial overview.</p>
                </div>
                {isCreating ? (
                    <div className="flex items-center gap-2 bg-brand-surface p-2 rounded-lg border border-white/10">
                        <select
                            className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-32"
                            value={selectedClientId}
                            onChange={e => setSelectedClientId(e.target.value)}
                        >
                            <option value="">Client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input
                            type="number"
                            className="px-3 py-1 bg-brand-dark rounded text-sm outline-none w-24"
                            placeholder="Amount"
                            value={newInvoiceAmount}
                            onChange={e => setNewInvoiceAmount(e.target.value)}
                        />
                        <button onClick={handleCreateInvoice} className="text-green-500 font-bold px-2">Save</button>
                        <button onClick={() => setIsCreating(false)} className="text-red-500 px-2">X</button>
                    </div>
                ) : (
                    <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
                        <Plus size={16} />
                        Create Invoice
                    </button>
                )}
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-xs text-green-500 font-medium">+12%</span>
                    </div>
                    <p className="text-gray-400 text-sm">Total Revenue (YTD)</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                </div>
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Pending Invoices</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{pendingAmount.toLocaleString('en-IN')}</h3>
                </div>
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Overdue</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{overdueAmount.toLocaleString('en-IN')}</h3>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold">Recent Invoices</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input type="text" placeholder="Search invoices..." className="w-full bg-brand-dark border border-white/10 rounded-lg pl-10 h-9 text-sm outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-dark/30 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Invoice ID</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading invoices...</td></tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 font-medium text-white">{inv.id.slice(0, 8)}...</td>
                                    <td className="px-6 py-4">
                                        {inv.clients ? inv.clients.name : 'Unknown Client'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${inv.status === 'paid' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${inv.status === 'pending' ? 'bg-blue-500/10 text-blue-500' : ''}
                                            ${inv.status === 'overdue' ? 'bg-red-500/10 text-red-500' : ''}
                                        `}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handlePreviewClick(inv)}
                                                className="p-1 hover:text-blue-400 text-gray-400 transition-colors"
                                                title="Preview Invoice"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(inv)}
                                                className="p-1 hover:text-brand-primary text-gray-400 transition-colors"
                                                title="Edit Invoice"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteInvoice(inv.id)}
                                                className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                                                title="Delete Invoice"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && invoices.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No invoices found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Invoice Modal */}
            {editingInvoice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Edit Invoice</h3>
                            <button onClick={() => setEditingInvoice(null)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setEditingInvoice(null)}
                                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateInvoice}
                                className="px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary flex items-center gap-2"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Preview Modal */}
            <InvoiceModal
                invoice={previewInvoice}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>
    );
}
