'use client';

import { useEffect, useState } from 'react';
import { fetchApprovals, ApprovalItem } from '@/lib/data';
import { approveItem, rejectItem } from '@/actions/dashboard';
import { Check, X, MessageSquare, Clock } from 'lucide-react';

export default function ApprovalsPage() {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovals().then(data => {
            setItems(data.filter(i => i.status === 'pending')); // Only show pending in this view? Or all? Let's assume pending based on typical workflow, or maybe all and filter.
            // The previous mock data mostly returns pending for this view list, but let's show all or just pending. 
            // The dashboard showed 'Pending Approvals', this page suggests 'Pending Approvals' in title.
            // Let's filter client-side for now or rely on fetchApprovals returning what's needed.
            // fetchApprovals returns all. Let's filter for pending to match "Pending Approvals" title.
            // Actually, usually an approvals page might show history too. But title says "Pending Approvals".
            // I'll stick to showing all for now but maybe sort by pending first?
            // Re-reading code: title says "Pending Approvals".
            setLoading(false);
        });
    }, []);

    // Better effect with filtering
    useEffect(() => {
        fetchApprovals().then(data => {
            setItems(data.filter(i => i.status === 'pending'));
            setLoading(false);
        });
    }, []);


    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        // Optimistic update
        setItems(items.filter(i => i.id !== id));
        try {
            if (action === 'approve') {
                await approveItem(id);
            } else {
                await rejectItem(id);
            }
        } catch (error) {
            console.error(error);
            // Revert on error? For now simple optimistic.
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading approvals...</div>;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-white">Pending Approvals</h2>
                <p className="text-gray-400 text-sm mt-1">Review and approve creative assets to keep projects moving.</p>
            </div>

            {items.length === 0 ? (
                <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                        <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-white">All Caught Up!</h3>
                    <p className="text-gray-500 mt-2">You have no items waiting for review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden group">
                            {/* Preview Area */}
                            <div className="h-48 bg-gray-800 relative group-hover:opacity-90 transition-opacity cursor-pointer">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white uppercase">
                                    {item.type}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-white mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={12} /> Pending since {item.submitted_date}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleAction(item.id, 'approve')}
                                        className="flex-1 bg-brand-primary text-black font-bold py-2 rounded-lg hover:bg-brand-secondary transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(item.id, 'reject')}
                                        className="flex-1 bg-white/5 text-white py-2 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <X size={16} /> Changes
                                    </button>
                                </div>
                                <div className="mt-3 text-center">
                                    <button className="text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 mx-auto">
                                        <MessageSquare size={12} /> Add Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
