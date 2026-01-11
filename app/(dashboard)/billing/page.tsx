'use client';

import React, { useEffect, useState } from 'react';
import { Download, CreditCard, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { fetchInvoices, Invoice } from '@/lib/data';
import InvoiceModal from '@/components/dashboard/InvoiceModal';

export default function ClientBillingPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    useEffect(() => {
        fetchInvoices().then((data: any) => {
            setInvoices(data || []);
            setLoading(false);
        });
    }, []);

    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + (Number(i.amount) || 0), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsInvoiceModalOpen(true);
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading billing info...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Billing & Invoices</h1>
                <p className="text-gray-400 text-sm mt-1">View your invoices and payment history.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Total Paid</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalPaid)}</h3>
                </div>
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalPending)}</h3>
                </div>
                <div className="bg-brand-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <h3 className="text-lg font-bold text-white mt-1">•••• 4242</h3>
                    <p className="text-xs text-gray-500">Visa</p>
                </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-bold">Invoice History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-dark/30 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No invoices found.</td>
                                </tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 font-medium text-white">#{inv.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {inv.description || (inv.clients ? `Invoice for ${inv.clients.name}` : 'General Invoice')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(Number(inv.amount))}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${inv.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}
                                        `}>
                                            {inv.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleViewInvoice(inv)}
                                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                                title="View Invoice"
                                            >
                                                <Eye size={14} />
                                                <span className="text-xs hidden sm:inline">View</span>
                                            </button>
                                            <button
                                                onClick={() => handleViewInvoice(inv)}
                                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                                title="Download PDF"
                                            >
                                                <Download size={14} />
                                                <span className="text-xs hidden sm:inline">Download</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <InvoiceModal
                invoice={selectedInvoice}
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
            />
        </div>
    );
}
