
'use client';

import React, { useEffect, useState } from 'react';
import { fetchApprovals, ApprovalItem } from '@/lib/data';
import { Search, CheckCircle, XCircle, Clock, Eye, MessageSquare, X, Calendar, FileText } from 'lucide-react';

export default function AdminApprovalsPage() {
    const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchApprovals();
            setApprovals(data);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="p-4 lg:p-10 text-center text-gray-500 text-xs lg:text-base">Loading approvals...</div>;

    return (
        <div className="space-y-3 lg:space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">Approvals</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Review and manage client sign-offs.</p>
                </div>
            </div>

            <div className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl overflow-hidden">
                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-white/5">
                    {approvals.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-xs">No approval requests found.</div>
                    ) : (
                        approvals.map(item => (
                            <div key={item.id} className="p-3 flex items-start gap-3">
                                <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden shrink-0">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-[9px] text-gray-500">N/A</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-white text-xs truncate">{item.title}</p>
                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium uppercase
                                            ${item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                                            ${item.status === 'uploaded' ? 'bg-gray-500/10 text-gray-400' : ''}
                                        `}>
                                            {item.status === 'pending' && <Clock className="w-2 h-2" />}
                                            {item.status === 'approved' && <CheckCircle className="w-2 h-2" />}
                                            {item.status === 'rejected' && <XCircle className="w-2 h-2" />}
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-brand-primary truncate">{item.projects?.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] text-gray-500">
                                            {new Date(item.submitted_date).toLocaleDateString()}
                                        </span>
                                        <span className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-gray-400 capitalize">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(item)}
                                    className="p-1.5 text-gray-400 hover:text-white shrink-0"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-dark/30">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Item</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Date Submitted</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Comments</th>
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
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-xs text-gray-500">N/A</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-brand-primary">{item.projects?.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs capitalize text-gray-300">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(item.submitted_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 max-w-[200px]">
                                        {item.comments ? (
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors text-left group"
                                            >
                                                <MessageSquare size={14} className="text-brand-primary shrink-0 group-hover:scale-110 transition-transform" />
                                                <span className="truncate max-w-[150px]">{item.comments}</span>
                                            </button>
                                        ) : (
                                            <span className="text-gray-600 ml-1">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase
                                            ${item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                                            ${item.status === 'uploaded' ? 'bg-gray-500/10 text-gray-400' : ''}
                                        `}>
                                            {item.status === 'pending' && <Clock size={12} />}
                                            {item.status === 'approved' && <CheckCircle size={12} />}
                                            {item.status === 'rejected' && <XCircle size={12} />}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {approvals.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No approval requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 lg:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-white/5">
                            <h3 className="text-base lg:text-xl font-bold">Asset Details</h3>
                            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                        </div>

                        <div className="p-4 lg:p-6 overflow-y-auto flex-1">
                            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                                {/* Left Column: Preview */}
                                <div className="w-full md:w-1/2">
                                    <div className="bg-black/40 rounded-lg overflow-hidden border border-white/5 aspect-video flex items-center justify-center">
                                        {selectedItem.thumbnail ? (
                                            <img src={selectedItem.thumbnail} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-gray-500 flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 lg:w-10 lg:h-10" />
                                                <span className="text-xs lg:text-sm">No Preview Available</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 lg:mt-4 flex justify-center">
                                        {selectedItem.file_url && (
                                            <a
                                                href={selectedItem.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs lg:text-sm text-brand-primary hover:underline font-medium"
                                            >
                                                Download / View Original
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Info */}
                                <div className="w-full md:w-1/2 space-y-4 lg:space-y-6">
                                    <div>
                                        <h4 className="text-lg lg:text-2xl font-bold text-white mb-1">{selectedItem.title}</h4>
                                        <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-400">
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] lg:text-xs uppercase tracking-wide">{selectedItem.type}</span>
                                            <span>•</span>
                                            <span>{selectedItem.projects?.title}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 lg:space-y-4">
                                        <div className="flex items-start gap-2 lg:gap-3">
                                            <Calendar className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] lg:text-sm text-gray-400">Submitted on</p>
                                                <p className="text-white font-medium text-xs lg:text-base">{new Date(selectedItem.submitted_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 lg:gap-3">
                                            {selectedItem.status === 'approved' && <CheckCircle className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-green-500 mt-0.5" />}
                                            {selectedItem.status === 'rejected' && <XCircle className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-red-500 mt-0.5" />}
                                            {(selectedItem.status === 'pending' || selectedItem.status === 'uploaded') && <Clock className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-yellow-500 mt-0.5" />}
                                            <div>
                                                <p className="text-[10px] lg:text-sm text-gray-400">Status</p>
                                                <p className={`font-bold capitalize text-xs lg:text-base
                                                    ${selectedItem.status === 'approved' ? 'text-green-500' : ''}
                                                    ${selectedItem.status === 'rejected' ? 'text-red-500' : ''}
                                                    ${selectedItem.status === 'pending' ? 'text-yellow-500' : 'text-gray-300'}
                                                `}>
                                                    {selectedItem.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/5">
                                        <div className="flex items-center gap-2 mb-1.5 lg:mb-2 text-gray-300 font-medium text-xs lg:text-base">
                                            <MessageSquare className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-primary" />
                                            Client Feedback
                                        </div>
                                        {selectedItem.comments ? (
                                            <p className="text-gray-300 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">
                                                "{selectedItem.comments}"
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 text-xs lg:text-sm italic">
                                                No comments provided.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
