'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchUser, Profile, supabase } from '@/lib/data';
import { User, Bell, Shield, Lock, Camera, Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUser().then(data => {
            // @ts-ignore
            setUser(data);
            setLoading(false);
        });
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0 || !user) {
                return;
            }
            setUploading(true);

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setUser({ ...user, avatar_url: data.publicUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: user.full_name,
                    company: user.company,
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 sm:p-10 text-center text-gray-500">Loading settings...</div>;
    if (!user) return <div className="p-6 sm:p-10 text-center text-gray-500">User not found.</div>;

    return (
        <div className="max-w-3xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-white mb-4 sm:mb-6 md:mb-8">Account Settings</h2>

            <div className="space-y-4 sm:space-y-6">
                {/* Profile Section */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-brand-primary/10 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-primary transition-all">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-primary" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {uploading ? <Loader2 size={16} className="sm:w-5 sm:h-5 text-white animate-spin" /> : <Camera size={16} className="sm:w-5 sm:h-5 text-white" />}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-white">Profile Information</h3>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Update your account details and company info.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-brand-primary text-brand-dark font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 text-xs sm:text-sm"
                        >
                            {saving ? <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" /> : <Save size={14} className="sm:w-4 sm:h-4" />}
                            Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm text-gray-400">Full Name</label>
                            <input
                                type="text"
                                value={user.full_name || ''}
                                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                                className="w-full bg-brand-dark border border-white/5 rounded-lg p-2 sm:p-2.5 text-sm text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm text-gray-400">Email Address</label>
                            <input
                                type="email"
                                defaultValue={(user as any).email || 'user@example.com'}
                                disabled
                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 sm:p-2.5 text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 md:col-span-1">
                            <label className="text-xs sm:text-sm text-gray-400">Company Name</label>
                            <input
                                type="text"
                                value={user.company || ''}
                                onChange={(e) => setUser({ ...user, company: e.target.value })}
                                className="w-full bg-brand-dark border border-white/5 rounded-lg p-2 sm:p-2.5 text-sm text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-blue-500/10 rounded-md sm:rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                            <Bell size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-white">Notifications</h3>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Manage how you receive updates.</p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {['E-mail notifications for approvals', 'Project status updates', 'New report availability'].map((label, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 sm:py-2">
                                <span className="text-brand-white text-xs sm:text-sm">{label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-red-500/10 rounded-md sm:rounded-lg flex items-center justify-center text-red-500 shrink-0">
                            <Shield size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-white">Security</h3>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Manage password and access.</p>
                        </div>
                    </div>

                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 text-brand-white rounded-lg transition-colors text-xs sm:text-sm">
                        <Lock size={14} className="sm:w-4 sm:h-4" /> Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
