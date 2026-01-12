import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default async function TagPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();

    // Get Tag
    const { data: tag } = await supabase.from('blog_tags').select('id, name').eq('slug', params.slug).single();
    if (!tag) notFound();

    // Fetch Posts via Junction
    const { data: postsData } = await supabase
        .from('blog_post_tags')
        .select(`
            post_id,
            blog_posts (
                *,
                blog_categories(name)
            )
        `)
        .eq('tag_id', tag.id);

    // Filter published
    const posts = postsData?.map(item => item.blog_posts).filter((p: any) => p.status === 'published') || [];

    return (
        <div className="min-h-screen bg-brand-darker text-brand-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors mb-6">
                        <ArrowLeft size={16} /> All Posts
                    </Link>
                    <h1 className="text-4xl font-bold font-display">
                        <span className="text-gray-500 font-normal">Tag:</span> {tag.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-brand-surface/30 border border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/20 hover:bg-brand-surface/50 transition-all duration-300">
                            <div className="aspect-[16/10] bg-brand-dark overflow-hidden relative">
                                {post.cover_image && (
                                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm font-medium text-brand-white group-hover:text-brand-primary transition-colors mt-auto">
                                    Read More <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                    {posts.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            No posts found for this tag.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
