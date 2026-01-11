import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
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

    // Enforce Admin Role
    if (profile?.role !== 'admin') {
        // unauthorized -> redirect to client dashboard or home
        redirect('/dashboard');
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
