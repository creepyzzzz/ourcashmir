import { createClient } from '@/utils/supabase/server';
import BlogEditor from '@/components/blog-panel/BlogEditor';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch Post and its Tags
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            tags:blog_post_tags(
                id:tag_id
            )
        `)
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    return <BlogEditor initialData={post} isEditing={true} />;
}
