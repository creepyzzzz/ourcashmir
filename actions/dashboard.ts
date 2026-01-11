'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('approvals')
        .update({ status: 'approved' })
        .eq('id', id);

    if (error) {
        console.error('Error approving item:', error);
        throw new Error('Failed to approve item');
    }

    revalidatePath('/dashboard');
    revalidatePath('/approvals');
}

export async function rejectItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('approvals')
        .update({ status: 'rejected' })
        .eq('id', id);

    if (error) {
        console.error('Error rejecting item:', error);
        throw new Error('Failed to reject item');
    }

    revalidatePath('/dashboard');
    revalidatePath('/approvals');
}
