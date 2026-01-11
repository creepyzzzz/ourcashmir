
'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, Shield, Mail, MoreVertical } from 'lucide-react';
import { fetchTeamMembers, Profile } from '@/lib/data';

export default function AdminTeamPage() {
    const [team, setTeam] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTeam() {
            setLoading(true);
            const data = await fetchTeamMembers();
            setTeam(data as Profile[]);
            setLoading(false);
        }
        loadTeam();
    }, []);

    // Placeholder for Invite - requires efficient Auth management usually
    const handleInvite = () => {
        alert("Invite feature requires Supabase Auth Admin integration or Edge Function. Currently read-only.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage internal team members and permissions.</p>
                </div>
                <button
                    onClick={handleInvite}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors"
                >
                    <UserPlus size={16} />
                    Invite Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-500">Loading team...</div>
                ) : team.map(member => (
                    <div key={member.id} className="bg-brand-surface border border-white/5 rounded-xl p-6 flex flex-col items-center text-center hover:border-brand-primary/20 transition-all group relative">
                        <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl font-bold text-brand-primary mb-4 border border-brand-primary/20 overflow-hidden">
                            {member.avatar_url ? (
                                <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                (member.email?.[0] || 'U').toUpperCase()
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-white">{member.full_name || 'Team Member'}</h3>
                        <div className="flex items-center gap-1.5 mt-1 mb-4">
                            <Shield size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-400 capitalize">{member.role}</span>
                        </div>

                        <div className="w-full pt-4 border-t border-white/5">
                            <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <Mail size={14} />
                                {member.email}
                            </a>
                        </div>
                    </div>
                ))}
                {!loading && team.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No team members found with role 'admin' or 'staff'.
                    </div>
                )}
            </div>
        </div>
    );
}
