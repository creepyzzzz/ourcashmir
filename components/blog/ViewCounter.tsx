'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ViewCounter({ postId }: { postId: string }) {
    useEffect(() => {
        const increment = async () => {
            const supabase = createClient();
            await supabase.rpc('increment_view_count', { post_id: postId });
        };
        increment();
    }, [postId]);

    return null;
}
