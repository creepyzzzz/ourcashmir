'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchUser, Profile, supabase } from '@/lib/data';
import { User, Bell, Shield, Lock, Camera, Loader2, Save } from 'lucide-react';

export default function AdminSettingsPage() {
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

            // Upload to 'avatars' bucket (assuming it exists or was created previously, likely shared with client)
            const { error: uploadError } = await supabase.storage
                .from('avatars') // Using same bucket as client settings
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setUser({ ...user, avatar_url: data.publicUrl });

            // Dispatch custom event to notify other components (Sidebar/Header)
            window.dispatchEvent(new Event('profile-updated'));

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar. Please try again.');
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
                    // role is likely not editable
                })
                .eq('id', user.id);

            if (error) throw error;

            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event('profile-updated'));

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 lg:p-10 text-center text-gray-500 text-xs lg:text-base">Loading settings...</div>;
    if (!user) return <div className="p-4 lg:p-10 text-center text-gray-500 text-xs lg:text-base">User not found.</div>;

    return (
        <div className="max-w-4xl space-y-4 lg:space-y-8">
            <div>
                <h1 className="text-lg lg:text-2xl font-bold tracking-tight text-brand-white">Admin Settings</h1>
                <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Configure your admin profile and preferences.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-lg lg:rounded-xl p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 mb-6 lg:mb-8 border-b border-white/5 pb-6 lg:pb-8">
                    <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                        <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-brand-primary/10 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-primary transition-all shadow-lg shadow-black/50">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 lg:w-10 lg:h-10 text-brand-primary" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading ? <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 text-white animate-spin" /> : <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-white" />}
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
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-base lg:text-xl font-bold text-brand-white">Profile Information</h3>
                        <p className="text-xs lg:text-sm text-gray-500 mb-3 lg:mb-4">Update your photo and personal details.</p>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1.5 lg:gap-2 bg-brand-primary text-black font-bold px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 text-xs lg:text-sm mx-auto sm:mx-0"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
                    <div className="space-y-1.5 lg:space-y-2">
                        <label className="text-xs lg:text-sm text-gray-400 font-medium">Full Name</label>
                        <input
                            type="text"
                            value={user.full_name || ''}
                            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="space-y-1.5 lg:space-y-2">
                        <label className="text-xs lg:text-sm text-gray-400 font-medium">Email Address</label>
                        <input
                            type="email"
                            defaultValue={(user as any).email || ''}
                            disabled
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-1.5 lg:space-y-2">
                        <label className="text-xs lg:text-sm text-gray-400 font-medium">Role</label>
                        <input
                            type="text"
                            defaultValue={user.role?.toUpperCase() || 'ADMIN'}
                            disabled
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-1.5 lg:space-y-2">
                        <label className="text-xs lg:text-sm text-gray-400 font-medium">Company / Agency Name</label>
                        <input
                            type="text"
                            value={user.company || ''}
                            onChange={(e) => setUser({ ...user, company: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            placeholder="Agency Name"
                        />
                    </div>
                </div>
            </div>

            {/* System Preferences (Mocked for now) */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-lg lg:rounded-xl p-4 lg:p-6 opacity-75">
                <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/10 rounded-md lg:rounded-lg flex items-center justify-center text-blue-500">
                        <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <h3 className="text-sm lg:text-lg font-bold text-brand-white">Notifications (Coming Soon)</h3>
                </div>
                <p className="text-xs lg:text-sm text-gray-500">Global system notification settings will be available here.</p>
            </div>
        </div>
    );
}
