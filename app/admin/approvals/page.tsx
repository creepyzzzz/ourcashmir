
'use client';

import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default function AdminApprovalsPage() {
    const [approvals, setApprovals] = useState<any[]>([]);

    useEffect(() => {
        // Dummy data or real fetch later
        setApprovals([]);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
                    <p className="text-gray-400 text-sm mt-1">Review and manage client sign-offs.</p>
                </div>
            </div>

            <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-dark/30">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Item</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Date Submitted</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {approvals.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden shrink-0">
                                                <img src={item.thumbnail} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-gray-500">Client ID: {item.clientId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs capitalize text-gray-300">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {item.submittedDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                            ${item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                                        `}>
                                            {item.status === 'pending' && <Clock size={12} />}
                                            {item.status === 'approved' && <CheckCircle size={12} />}
                                            {item.status === 'rejected' && <XCircle size={12} />}
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            {item.status === 'pending' && (
                                                <>
                                                    <button className="p-2 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {approvals.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No approval requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
