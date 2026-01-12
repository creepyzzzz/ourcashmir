'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Loader2, Lock, KeyRound, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type AuthView = 'login' | 'signup' | 'forgot';
type AuthMethod = 'password' | 'magic';

export default function LoginPage() {
    const [view, setView] = useState<AuthView>('login');
    const [authMethod, setAuthMethod] = useState<AuthMethod>('password'); // Default to password as requested

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profile?.role === 'blog_poster') {
                    router.replace('/blog-panel');
                } else {
                    router.replace('/dashboard');
                }
            }
        };
        checkUser();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (view === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Password reset link sent! Check your email.' });
            }
            else if (authMethod === 'magic') {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Magic link sent! Check your email to continue.' });
            }
            else {
                // Password Login / Signup
                if (view === 'signup') {
                    const { error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            emailRedirectTo: `${window.location.origin}/auth/callback`,
                        },
                    });
                    if (error) throw error;
                    setMessage({ type: 'success', text: 'Account created! Please check your email to verify.' });
                } else {
                    // Login
                    const { data: { user }, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (error) throw error;

                    if (user) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', user.id)
                            .single();

                        if (profile?.role === 'blog_poster') {
                            router.replace('/blog-panel');
                        } else {
                            router.replace('/dashboard');
                        }
                    } else {
                        router.replace('/dashboard');
                    }
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error(error);
    };

    const toggleView = (newView: AuthView) => {
        setView(newView);
        setMessage(null);
    };

    return (
        <div className="w-full min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-auto lg:overflow-hidden bg-brand-darker text-brand-white font-sans">

            {/* Left Side - Branding (Hidden on mobile) */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-col relative w-1/2 h-full bg-brand-surface border-r border-brand-primary/10 p-12 justify-between"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,200,83,0.1),_transparent_70%)] pointer-events-none" />

                {/* Logo Area */}
                <Link href="/" className="z-10 flex items-center gap-2 group w-fit">
                    <div className="w-2 h-2 bg-brand-primary rounded-full group-hover:animate-pulse" />
                    <span className="font-bold tracking-tight text-xl font-display">OURCASHMIR</span>
                </Link>

                {/* Center Content / Visual */}
                <div className="z-10 max-w-lg">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl font-bold leading-tight mb-6"
                    >
                        Elevate Your <span className="text-brand-primary">Brand</span> Influence.
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg text-gray-400"
                    >
                        Join the platform where top-tier brands and elite influencers collaborate to create viral marketing campaigns.
                    </motion.p>
                </div>

                {/* Footer Quote */}
                <div className="z-10">
                    <blockquote className="text-gray-500 italic">
                        "The future of marketing is not about ads, it's about connections."
                    </blockquote>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex-1 lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
                {/* Mobile Logo */}
                <div className="absolute top-4 left-4 lg:hidden">
                    <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-white transition-colors">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                        <span className="font-bold">OURCASHMIR</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-5 lg:space-y-8 pt-10 lg:pt-0"
                >

                    <div className="text-center space-y-1 lg:space-y-2">
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                            {view === 'login' ? 'Welcome back' : view === 'signup' ? 'Create an account' : 'Reset Password'}
                        </h2>
                        <p className="text-gray-400 text-xs lg:text-sm">
                            {view === 'login' ? 'Enter your details to sign in'
                                : view === 'signup' ? 'Start your journey with us today'
                                    : 'Enter your email to receive recovery instructions'}
                        </p>
                    </div>

                    {view !== 'forgot' && (
                        <div className="flex bg-brand-dark p-0.5 lg:p-1 rounded-lg border border-brand-primary/10">
                            <button
                                onClick={() => setAuthMethod('password')}
                                className={`flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-md transition-all ${authMethod === 'password' ? 'bg-brand-surface text-brand-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                <Lock className="w-3 h-3" /> Password
                            </button>
                            <button
                                onClick={() => setAuthMethod('magic')}
                                className={`flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-md transition-all ${authMethod === 'magic' ? 'bg-brand-surface text-brand-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                <Sparkles className="w-3 h-3" /> Magic Link
                            </button>
                        </div>
                    )}

                    <div className="space-y-3 lg:space-y-4">
                        {/* Google Login - Only show for Login/Signup */}
                        {view !== 'forgot' && (
                            <>
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-2 lg:gap-3 bg-brand-dark border border-brand-primary/20 hover:border-brand-primary/50 text-white p-2.5 lg:p-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors" />
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 relative z-10" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="relative z-10 font-medium text-xs lg:text-sm">Continue with Google</span>
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-800" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] lg:text-xs uppercase">
                                        <span className="bg-brand-darker px-2 text-gray-500">Or continue with {authMethod}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Auth Form */}
                        <form onSubmit={handleAuth} className="space-y-3 lg:space-y-4">
                            <div className="space-y-1.5 lg:space-y-2">
                                <label className="text-[10px] lg:text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 lg:left-3 top-2.5 lg:top-3 w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-brand-dark border border-gray-800 focus:border-brand-primary text-white pl-9 lg:pl-10 p-2.5 lg:p-3 rounded-lg outline-none transition-colors placeholder:text-gray-600 text-sm lg:text-base"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Field - Show only if Password Mode AND not in Forgot Password view */}
                            {authMethod === 'password' && view !== 'forgot' && (
                                <div className="space-y-1.5 lg:space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] lg:text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                                        {view === 'login' && (
                                            <button
                                                type="button"
                                                onClick={() => toggleView('forgot')}
                                                className="text-[10px] lg:text-xs text-brand-primary hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 lg:left-3 top-2.5 lg:top-3 w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-brand-dark border border-gray-800 focus:border-brand-primary text-white pl-9 lg:pl-10 p-2.5 lg:p-3 rounded-lg outline-none transition-colors placeholder:text-gray-600 text-sm lg:text-base"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className={`text-xs lg:text-sm p-2.5 lg:p-3 rounded bg-brand-dark border ${message.type === 'error' ? 'border-red-500/50 text-red-200' : 'border-green-500/50 text-green-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-primary text-black font-bold p-2.5 lg:p-3 rounded-lg hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Toggle */}
                    <div className="text-center text-xs lg:text-sm">
                        {view === 'forgot' ? (
                            <button
                                onClick={() => toggleView('login')}
                                className="text-brand-primary hover:underline font-medium flex items-center justify-center gap-2 w-full"
                            >
                                Back to login
                            </button>
                        ) : (
                            <>
                                <span className="text-gray-500">
                                    {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                                </span>
                                <button
                                    onClick={() => toggleView(view === 'login' ? 'signup' : 'login')}
                                    className="text-brand-primary hover:underline font-medium"
                                >
                                    {view === 'login' ? 'Sign up' : 'Log in'}
                                </button>
                            </>
                        )}
                    </div>

                    <p className="text-center text-[10px] lg:text-xs text-gray-600 mt-4 lg:mt-6">
                        By clicking continue, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-gray-400">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
