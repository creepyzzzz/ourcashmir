'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');

    const handleMockAuth = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Mock auth for:', email);
        alert('Mock Login/Signup Successful!');
        window.location.href = '/';
    };

    return (
        <div className="w-full h-screen flex overflow-hidden bg-brand-darker text-brand-white font-sans">

            {/* Left Side - Branding (Hidden on mobile) */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-white transition-colors">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                        Back to Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {isLogin ? 'Enter your details to sign in' : 'Start your journey with us today'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Login */}
                        <button
                            onClick={() => {
                                alert('Mock Google Login');
                                window.location.href = '/';
                            }}
                            className="w-full flex items-center justify-center gap-3 bg-brand-dark border border-brand-primary/20 hover:border-brand-primary/50 text-white p-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors" />
                            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
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
                            <span className="relative z-10 font-medium">Continue with Google</span>
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-brand-darker px-2 text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleMockAuth} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-brand-dark border border-gray-800 focus:border-brand-primary text-white pl-10 p-3 rounded-lg outline-none transition-colors placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 ml-1">
                                        Password setup will be handled via email link for simplicity.
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-brand-primary text-black font-bold p-3 rounded-lg hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 group"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* Toggle */}
                    <div className="text-center text-sm">
                        <span className="text-gray-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-brand-primary hover:underline font-medium"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-600 mt-6">
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
