import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check if user is logged in
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Check role from profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    // If Admin tries to access Client Dashboard, redirect to Admin Panel
    if (profile?.role === 'admin') {
        redirect('/admin');
    }

    // Future logic: If 'influencer' role exists, might need separate handling or allowed here.
    // For now, assuming default users (clients) and influencers use this dashboard.

    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}
