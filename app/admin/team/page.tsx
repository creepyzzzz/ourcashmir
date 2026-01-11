
'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, Shield, Mail, MoreVertical, Search, X, Check, Trash2, Edit } from 'lucide-react';
import { fetchTeamMembers, updateProfile, searchProfiles, Profile } from '@/lib/data';

export default function AdminTeamPage() {
    const [team, setTeam] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    // Search/Invite State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Promote Flow State
    const [selectedUserToPromote, setSelectedUserToPromote] = useState<Profile | null>(null);
    const [promoteRole, setPromoteRole] = useState<'admin' | 'staff'>('staff');
    const [promoteTitle, setPromoteTitle] = useState('');

    // Edit State
    const [editingMember, setEditingMember] = useState<Profile | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const loadTeam = async () => {
        setLoading(true);
        const data = await fetchTeamMembers();
        setTeam(data as Profile[]);
        setLoading(false);
    };

    useEffect(() => {
        loadTeam();
    }, []);

    // Reset when modal closes
    useEffect(() => {
        if (!isInviteModalOpen) {
            setSearchQuery('');
            setSelectedUserToPromote(null);
            setPromoteTitle('');
        }
    }, [isInviteModalOpen]);

    // Search Users to Add
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 2) {
                setIsSearching(true);
                const results = await searchProfiles(searchQuery);
                const teamIds = new Set(team.map(t => t.id));
                setSearchResults(results.filter(r => !teamIds.has(r.id)));
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, team]);

    const handleSelectUser = (user: Profile) => {
        setSelectedUserToPromote(user);
        setPromoteRole('staff');
        setPromoteTitle('');
    };

    const handleConfirmPromote = async () => {
        if (!selectedUserToPromote) return;
        try {
            await updateProfile(selectedUserToPromote.id, {
                role: promoteRole,
                company: promoteTitle || undefined // Use company field for Job Title
            });
            setIsInviteModalOpen(false);
            loadTeam();
        } catch (error: any) {
            console.error(error);
            if (error?.message?.includes('violates check constraint')) {
                alert(`Database Error: The '${promoteRole}' role is not allowed by the database schema.\n\nPLEASE RUN THIS SQL IN SUPABASE:\n\nALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;\nALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'admin', 'staff', 'influencer', 'inactive'));`);
            } else {
                alert('Failed to promote user.');
            }
        }
    };

    const handleStartEdit = (member: Profile) => {
        setEditingMember(member);
        setEditTitle(member.company || '');
    };

    const handleUpdateMember = async (role: 'admin' | 'staff' | 'client' | 'inactive') => {
        if (!editingMember) return;
        try {
            // If removing (client/inactive), warn user
            if (role === 'client' || role === 'inactive') {
                if (!confirm(`Remove ${editingMember.full_name} from the team?`)) return;
            }

            await updateProfile(editingMember.id, {
                role: role as any,
                company: editTitle || undefined
            });
            setEditingMember(null);
            loadTeam();
        } catch (error: any) {
            if (error?.message?.includes('violates check constraint')) {
                alert(`Database Error: The '${role}' role is not allowed by the database schema.\n\nPLEASE RUN THIS SQL IN SUPABASE:\n\nALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;\nALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'admin', 'staff', 'influencer', 'inactive'));`);
            } else {
                alert('Failed to update member: ' + (error?.message || 'Unknown error'));
            }
        }
    };

    const handleRemoveMember = async (member: Profile) => {
        if (!confirm(`Remove ${member.full_name} from the team?`)) return;
        try {
            await updateProfile(member.id, { role: 'client' });
            loadTeam();
        } catch (e) { alert('Failed to remove'); }
    };

    return (
        <div className="space-y-3 lg:space-y-6 relative">
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Manage internal team members and permissions.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black rounded-lg text-xs lg:text-sm font-bold hover:bg-brand-secondary transition-colors w-full sm:w-auto"
                >
                    <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Add Member
                </button>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-500 text-xs lg:text-sm">Loading team...</div>
                ) : team.map(member => (
                    <div key={member.id} className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl p-4 lg:p-6 flex flex-col items-center text-center hover:border-brand-primary/20 transition-all group relative">
                        {/* Actions Menu */}
                        <div className="absolute top-2 lg:top-3 right-2 lg:right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-1 lg:gap-2">
                            <button
                                onClick={() => handleStartEdit(member)}
                                className="p-1 lg:p-1.5 bg-brand-dark rounded-md text-gray-400 hover:text-white"
                                title="Edit Role"
                            >
                                <Edit className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            </button>
                            <button
                                onClick={() => handleRemoveMember(member)}
                                className="p-1 lg:p-1.5 bg-brand-dark rounded-md text-gray-400 hover:text-red-500"
                                title="Remove from Team"
                            >
                                <Trash2 className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            </button>
                        </div>

                        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl lg:text-2xl font-bold text-brand-primary mb-3 lg:mb-4 border border-brand-primary/20 overflow-hidden relative">
                            {/* Initials (Always rendered as background/fallback) */}
                            <span className="text-base lg:text-2xl">{(member.full_name?.[0] || member.email?.[0] || 'U').toUpperCase()}</span>

                            {/* Image (Overlays if available and valid) */}
                            {member.avatar_url && (
                                <img
                                    src={member.avatar_url}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover bg-brand-surface"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            )}
                        </div>

                        <h3 className="text-sm lg:text-lg font-bold text-white mb-0.5 lg:mb-1">{member.full_name || 'Team Member'}</h3>

                        {/* Display Custom Title if exists, else generic Role */}
                        <p className="text-[10px] lg:text-sm text-gray-400 mb-2 lg:mb-3">{member.company || (member.role === 'admin' ? 'Administrator' : 'Staff Member')}</p>

                        <div className={`
                            inline-flex items-center gap-1 lg:gap-1.5 px-1.5 lg:px-2 py-0.5 rounded text-[8px] lg:text-[10px] font-bold uppercase tracking-wider
                            ${member.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                        `}>
                            <Shield className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                            {member.role}
                        </div>

                        <div className="w-full pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-white/5 grid grid-cols-1 gap-2">
                            <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-1.5 lg:gap-2 text-[10px] lg:text-sm text-gray-400 hover:text-white transition-colors truncate">
                                <Mail className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
                                <span className="truncate">{member.email}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Promote Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 lg:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-3 lg:p-4 border-b border-white/10 flex justify-between items-center bg-brand-dark/50">
                            <h3 className="font-bold text-white text-sm lg:text-base">
                                {selectedUserToPromote ? 'Set Role & Title' : 'Add Team Member'}
                            </h3>
                            <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                        </div>

                        {!selectedUserToPromote ? (
                            <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                                <p className="text-xs lg:text-sm text-gray-400">Search for a user to add to the team.</p>
                                <div className="relative">
                                    <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                    <input
                                        autoFocus
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 lg:py-3 text-xs lg:text-sm outline-none focus:border-brand-primary transition-colors text-white"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5 lg:space-y-2 mt-3 lg:mt-4 max-h-48 lg:max-h-60 overflow-y-auto">
                                    {searchResults.map(user => (
                                        <div key={user.id} onClick={() => handleSelectUser(user)} className="flex items-center justify-between p-2 lg:p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 hover:border-brand-primary/30 border border-transparent transition-all">
                                            <div className="flex items-center gap-2 lg:gap-3">
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-brand-dark flex items-center justify-center text-[10px] lg:text-xs font-bold text-gray-400">
                                                    {(user.full_name?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs lg:text-sm font-medium text-white">{user.full_name}</p>
                                                    <p className="text-[10px] lg:text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] lg:text-xs text-brand-primary font-medium">Select</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                                <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 rounded-lg">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-brand-dark flex items-center justify-center text-base lg:text-lg font-bold text-white">
                                        {(selectedUserToPromote.full_name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm lg:text-base truncate">{selectedUserToPromote.full_name}</h4>
                                        <p className="text-[10px] lg:text-sm text-gray-400 truncate">{selectedUserToPromote.email}</p>
                                    </div>
                                    <button onClick={() => setSelectedUserToPromote(null)} className="text-[10px] lg:text-xs text-brand-primary hover:underline shrink-0">Change</button>
                                </div>

                                <div className="space-y-3 lg:space-y-4">
                                    <div>
                                        <label className="block text-[9px] lg:text-xs font-bold text-gray-500 uppercase mb-1.5 lg:mb-2">Permission Level</label>
                                        <div className="flex gap-2 lg:gap-3">
                                            <button
                                                onClick={() => setPromoteRole('staff')}
                                                className={`flex-1 py-2 lg:py-3 px-3 lg:px-4 rounded-lg border text-center text-xs lg:text-sm font-bold transition-all ${promoteRole === 'staff' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-brand-dark border-white/10 text-gray-400 hover:border-brand-primary/50'}`}
                                            >
                                                Staff
                                            </button>
                                            <button
                                                onClick={() => setPromoteRole('admin')}
                                                className={`flex-1 py-2 lg:py-3 px-3 lg:px-4 rounded-lg border text-center text-xs lg:text-sm font-bold transition-all ${promoteRole === 'admin' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-brand-dark border-white/10 text-gray-400 hover:border-brand-primary/50'}`}
                                            >
                                                Admin
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] lg:text-xs font-bold text-gray-500 uppercase mb-1.5 lg:mb-2">Custom Title (Optional)</label>
                                        <input
                                            value={promoteTitle}
                                            onChange={(e) => setPromoteTitle(e.target.value)}
                                            placeholder="e.g. Senior Copywriter"
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-white focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmPromote}
                                    className="w-full py-2 lg:py-3 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-secondary transition-colors text-xs lg:text-sm"
                                >
                                    Confirm & Add Member
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 lg:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-sm p-4 lg:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-4 lg:mb-6">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-brand-dark mx-auto flex items-center justify-center text-lg lg:text-xl font-bold text-gray-400 mb-2 lg:mb-3">
                                {(editingMember.full_name?.[0] || 'U').toUpperCase()}
                            </div>
                            <h3 className="font-bold text-base lg:text-lg text-white">{editingMember.full_name}</h3>
                            <p className="text-[10px] lg:text-sm text-gray-500">{editingMember.email}</p>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            <div>
                                <label className="block text-[9px] lg:text-xs font-bold text-gray-500 uppercase mb-1.5 lg:mb-2">Custom Title</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="e.g. Project Manager"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:border-brand-primary outline-none"
                                />
                            </div>

                            <div className="space-y-1.5 lg:space-y-2">
                                <label className="block text-[9px] lg:text-xs font-bold text-gray-500 uppercase">Permission Level</label>
                                <button
                                    onClick={() => handleUpdateMember('admin')}
                                    className={`w-full p-2 lg:p-3 rounded-lg border text-left flex items-center justify-between transition-all text-xs lg:text-sm ${editingMember.role === 'admin' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <span className="font-medium">Admin Access</span>
                                    {editingMember.role === 'admin' && <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                                </button>
                                <button
                                    onClick={() => handleUpdateMember('staff')}
                                    className={`w-full p-2 lg:p-3 rounded-lg border text-left flex items-center justify-between transition-all text-xs lg:text-sm ${editingMember.role === 'staff' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <span className="font-medium">Staff Access</span>
                                    {editingMember.role === 'staff' && <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-white/5 flex justify-end gap-2 lg:gap-3">
                            <button
                                onClick={() => setEditingMember(null)}
                                className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
