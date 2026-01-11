'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        const supabase = createClient();
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Password updated successfully! Redirecting...');
            // Redirect to home which handles role-based routing or dashboard
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }

        setLoading(false);
    };

    return (
        <div className="w-full h-screen flex overflow-hidden bg-brand-darker text-brand-white font-sans">
            {/* Left Side - Branding (Hidden on mobile) */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-col relative w-1/2 h-full bg-brand-surface border-r border-brand-primary/10 p-12 justify-between"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,200,83,0.1),_transparent_70%)] pointer-events-none" />

                <Link href="/" className="z-10 flex items-center gap-2 group w-fit">
                    <div className="w-2 h-2 bg-brand-primary rounded-full group-hover:animate-pulse" />
                    <span className="font-bold tracking-tight text-xl font-display">OURCASHMIR</span>
                </Link>

                <div className="z-10 max-w-lg">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl font-bold leading-tight mb-6"
                    >
                        Secure Your Account
                    </motion.h1>
                    <p className="text-lg text-gray-400">
                        Set a new password to access your dashboard and manage your campaigns.
                    </p>
                </div>

                <div className="z-10">
                    <blockquote className="text-gray-500 italic">
                        "Security is not a product, but a process."
                    </blockquote>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-12 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Set New Password</h2>
                        <p className="text-gray-400 text-sm">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-dark border border-gray-800 focus:border-brand-primary text-white pl-10 p-3 rounded-lg outline-none transition-colors placeholder:text-gray-600"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm p-3 rounded bg-brand-dark border ${message.includes('successfully') ? 'border-green-500/50 text-green-200' : 'border-red-500/50 text-red-200'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary text-black font-bold p-3 rounded-lg hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
