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

    if (loading) return <div className="p-10 text-center text-gray-500">Loading settings...</div>;
    if (!user) return <div className="p-10 text-center text-gray-500">User not found.</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-brand-white">Admin Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Configure your admin profile and preferences.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                    <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                        <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-primary transition-all shadow-lg shadow-black/50">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-brand-primary" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white" />}
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
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-brand-white">Profile Information</h3>
                        <p className="text-sm text-gray-500 mb-4">Update your photo and personal details.</p>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-brand-primary text-black font-bold px-5 py-2 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Full Name</label>
                        <input
                            type="text"
                            value={user.full_name || ''}
                            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Email Address</label>
                        <input
                            type="email"
                            defaultValue={(user as any).email || ''}
                            disabled
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Role</label>
                        <input
                            type="text"
                            defaultValue={user.role?.toUpperCase() || 'ADMIN'}
                            disabled
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Company / Agency Name</label>
                        <input
                            type="text"
                            value={user.company || ''}
                            onChange={(e) => setUser({ ...user, company: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-brand-white outline-none focus:border-brand-primary/50 transition-colors"
                            placeholder="Agency Name"
                        />
                    </div>
                </div>
            </div>

            {/* System Preferences (Mocked for now) */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6 mt-6 opacity-75">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                        <Bell size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-brand-white">Notifications (Coming Soon)</h3>
                </div>
                <p className="text-sm text-gray-500">Global system notification settings will be available here.</p>
            </div>
        </div>
    );
}
