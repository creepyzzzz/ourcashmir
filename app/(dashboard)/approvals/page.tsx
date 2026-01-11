'use client';

import { useEffect, useState } from 'react';
import { fetchApprovals, ApprovalItem, updateAssetStatus, updateAssetComment } from '@/lib/data';
import { Check, X, MessageSquare, Clock } from 'lucide-react';

export default function ApprovalsPage() {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'comment' | null>(null);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchApprovals();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);


    const handleActionClick = (id: string, action: 'approve' | 'reject' | 'comment') => {
        setActiveItemId(id);
        setActionType(action);
        setCommentModalOpen(true);
        setCommentText('');
    };

    const submitAction = async () => {
        if (!activeItemId || !actionType) return;

        try {
            if (actionType === 'comment') {
                await updateAssetComment(activeItemId, commentText);
                setItems(prev => prev.map(i => i.id === activeItemId ? { ...i, comments: commentText } : i));
            } else {
                await updateAssetStatus(activeItemId, actionType === 'approve' ? 'approved' : 'rejected', commentText);
                setItems(prev => prev.map(i => i.id === activeItemId ? { ...i, status: actionType === 'approve' ? 'approved' : 'rejected', comments: commentText } : i));
            }

            setCommentModalOpen(false);
            setActiveItemId(null);
            setActionType(null);
            setCommentText('');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-6 sm:p-10 text-center text-gray-500">Loading approvals...</div>;

    return (
        <div>
            <div className="mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-white">Approvals & Feedback</h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Review creative assets and provide feedback.</p>
            </div>

            {items.length === 0 ? (
                <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-brand-primary">
                        <Check size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-white">No Assets Found</h3>
                    <p className="text-gray-500 text-sm mt-2">There are no assets to display.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl overflow-hidden group flex flex-col">
                            {/* Preview Area */}
                            <div className="h-32 sm:h-40 md:h-48 bg-gray-800 relative group-hover:opacity-90 transition-opacity cursor-pointer">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500 text-xs">No Preview</div>
                                )}
                                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/60 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium text-white uppercase">
                                    {item.type}
                                </div>
                                <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium uppercase
                                    ${item.status === 'approved' ? 'bg-green-500 text-black' : ''}
                                    ${item.status === 'rejected' ? 'bg-red-500 text-white' : ''}
                                    ${item.status === 'pending' ? 'bg-yellow-500 text-black' : ''}
                                    ${item.status === 'uploaded' ? 'bg-gray-500 text-white' : ''}
                                `}>
                                    {item.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
                                <div className="mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-white mb-1">{item.title}</h3>
                                    <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={10} className="sm:w-3 sm:h-3" /> {new Date(item.submitted_date || item.created_at).toLocaleDateString()}
                                    </p>
                                    {item.projects?.title && <p className="text-[10px] sm:text-xs text-brand-primary mt-1">{item.projects.title}</p>}
                                </div>

                                {item.comments && (
                                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white/5 rounded-lg text-xs sm:text-sm text-gray-300 italic">
                                        "{item.comments}"
                                    </div>
                                )}

                                {/* Actions */}
                                {item.status === 'pending' && (
                                    <div className="mt-auto pt-3 sm:pt-4 border-t border-white/5 flex flex-col gap-2 sm:gap-3">
                                        <div className="flex gap-2 sm:gap-3">
                                            <button
                                                onClick={() => handleActionClick(item.id, 'approve')}
                                                className="flex-1 bg-brand-primary text-black font-bold py-1.5 sm:py-2 rounded-lg hover:bg-brand-secondary transition-colors text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                                            >
                                                <Check size={14} className="sm:w-4 sm:h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleActionClick(item.id, 'reject')}
                                                className="flex-1 bg-white/5 text-white py-1.5 sm:py-2 rounded-lg hover:bg-white/10 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                                            >
                                                <X size={14} className="sm:w-4 sm:h-4" /> Reject
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleActionClick(item.id, 'comment')}
                                            className="w-full text-[10px] sm:text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 p-1 hover:bg-white/5 rounded transition-colors"
                                        >
                                            <MessageSquare size={10} className="sm:w-3 sm:h-3" /> Add Comment
                                        </button>
                                    </div>
                                )}
                                {item.status !== 'pending' && (
                                    <div className="mt-auto pt-3 sm:pt-4 border-t border-white/5 text-center text-[10px] sm:text-xs text-gray-500">
                                        Status updated on {new Date().toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comment Modal */}
            {commentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-lg sm:rounded-xl w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                            {actionType === 'approve' ? 'Approve Asset' : actionType === 'reject' ? 'Request Changes' : 'Add Comment'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                            {actionType === 'approve'
                                ? 'Is this asset looking good? Add any final notes (optional).'
                                : actionType === 'reject'
                                    ? 'Please describe what changes are needed.'
                                    : 'Add a note for the team without changing the status.'}
                        </p>
                        <textarea
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 sm:p-3 text-xs sm:text-sm outline-none focus:border-brand-primary min-h-[80px] sm:min-h-[100px]"
                            placeholder="Add your comments here..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <button
                                onClick={() => setCommentModalOpen(false)}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitAction}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2
                                    ${actionType === 'approve' ? 'bg-green-500 text-black hover:bg-green-400' : ''}
                                    ${actionType === 'reject' ? 'bg-red-500 text-white hover:bg-red-400' : ''}
                                    ${actionType === 'comment' ? 'bg-brand-surface border border-white/10 text-white hover:bg-white/5' : ''}
                                `}
                            >
                                {actionType === 'approve' && <Check size={14} />}
                                {actionType === 'reject' && <X size={14} />}
                                {actionType === 'comment' && <MessageSquare size={14} />}

                                {actionType === 'approve' ? 'Confirm' : actionType === 'reject' ? 'Submit' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
