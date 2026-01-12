'use client';

import { Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePostButton({ postId }: { postId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', postId);

            if (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post: ' + error.message);
                return;
            }

            router.refresh();
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Post"
        >
            <Trash2 size={16} />
        </button>
    );
}
