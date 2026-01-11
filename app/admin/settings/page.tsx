
'use client';

import React from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Configure system preferences and agency profile.</p>
            </div>

            {/* General Settings */}
            <div className="bg-brand-surface border border-white/5 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-bold border-b border-white/5 pb-4">Agency Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Agency Name</label>
                        <input type="text" defaultValue="OurCashmir Agency" className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Support Email</label>
                        <input type="email" defaultValue="support@ourcashmir.com" className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Brand Color (Hex)</label>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00C853] border border-white/10" />
                        <input type="text" defaultValue="#00C853" className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-brand-surface border border-white/5 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-bold border-b border-white/5 pb-4">Notifications</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-white">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive daily summaries and critical alerts.</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-white">New Lead Alerts</p>
                            <p className="text-xs text-gray-500">Get notified immediately when a form is submitted.</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-secondary transition-colors">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
