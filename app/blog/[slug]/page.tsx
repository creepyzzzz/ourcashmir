import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Tag, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Metadata } from 'next';
import ViewCounter from '@/components/blog/ViewCounter';

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();

    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt || '',
            images: post.cover_image ? [post.cover_image] : [],
            type: 'article',
            publishedTime: post.published_at || undefined,
        },
    };
}

// Simple Renderer since we don't have a package installed yet
// In a real app we'd use 'react-markdown' or 'next-mdx-remote'
const HTMLContent = ({ content }: { content: string }) => {
    if (!content) return null;

    return (
        <div
            className="prose prose-sm lg:prose-lg max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-gray-300
            prose-a:no-underline prose-a:border-b prose-a:border-brand-primary/50 prose-a:transition-all hover:prose-a:border-brand-primary
            prose-img:rounded-xl lg:prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
            prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:bg-brand-surface prose-blockquote:py-2 prose-blockquote:px-4 lg:prose-blockquote:px-6 prose-blockquote:rounded-r-lg
            "
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch Post
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            blog_categories(name, slug),
            tags:blog_post_tags(
                blog_tags(id, name, slug)
            ),
            author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-brand-darker text-brand-white pb-10 lg:pb-20 overflow-x-hidden selection:bg-brand-primary/30 selection:text-brand-white">
            <ViewCounter postId={post.id} />

            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-0 w-full h-[40vh] bg-brand-primary/5 blur-[100px] pointer-events-none z-0" />

            {/* Cinematic Hero Section */}
            <div className="relative w-full h-[30vh] lg:h-[55vh] min-h-[250px] lg:min-h-[400px] flex items-end justify-center pb-6 lg:pb-16">
                {/* Background Image with Overlay */}
                {post.cover_image && (
                    <div className="absolute inset-0 z-0">
                        <img src={post.cover_image} alt="Background" className="w-full h-full object-cover opacity-30 blur-sm scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/90 to-transparent" />
                        <div className="absolute inset-0 bg-brand-darker/50" />
                    </div>
                )}

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-3 lg:space-y-6">
                    {/* Category Chip */}
                    {post.blog_categories && (
                        <div className="flex justify-center">
                            <Link href={`/blog/category/${post.blog_categories.slug}`}
                                className="inline-flex items-center px-2.5 py-0.5 lg:px-4 lg:py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-brand-darker transition-all duration-300 backdrop-blur-md">
                                {post.blog_categories.name}
                            </Link>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-bold font-display leading-snug tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-xl max-w-5xl mx-auto">
                        {post.title}
                    </h1>

                    {/* Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-6 text-[10px] lg:text-base text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5 lg:gap-3 bg-white/5 pl-1.5 pr-2.5 py-0.5 lg:px-4 lg:py-2 rounded-full border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            {post.author?.avatar_url ? (
                                <img src={post.author.avatar_url} alt="" className="w-5 h-5 lg:w-8 lg:h-8 rounded-full object-cover ring-1 lg:ring-2 ring-brand-primary/20" />
                            ) : (
                                <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-[10px] lg:text-xs font-bold">
                                    {(post.author?.full_name || 'A')[0]}
                                </div>
                            )}
                            <span>{post.author?.full_name || 'Admin'}</span>
                        </div>

                        <div className="hidden sm:block w-px h-4 lg:h-6 bg-white/10" />

                        <div className="flex items-center gap-1.5 lg:gap-2">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-brand-primary" />
                            {new Date(post.published_at!).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                        </div>

                        <div className="hidden sm:block w-px h-4 lg:h-6 bg-white/10" />

                        <div className="flex items-center gap-1.5 lg:gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-brand-primary" />
                            {post.reading_time_minutes || 5} min
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-20 max-w-[1600px] mx-auto px-0 sm:px-6 lg:px-8 -mt-4 lg:-mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-16">

                    {/* Left Sidebar: Share & Actions */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-32 flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-px h-20 bg-linear-to-b from-transparent via-brand-primary/30 to-transparent" />
                            <Link href="/blog" className="p-3 rounded-full bg-brand-surface border border-white/5 text-gray-400 hover:text-brand-white hover:bg-white/5 hover:scale-110 transition-all duration-300" title="Back to Blog">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <button className="p-3 rounded-full bg-brand-surface border border-white/5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 hover:scale-110 transition-all duration-300 group">
                                <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </button>
                            <div className="w-px h-full min-h-[100px] bg-linear-to-b from-brand-primary/30 via-white/5 to-transparent" />
                        </div>
                    </div>

                    {/* Center Column: Content */}
                    <main className="lg:col-span-8 bg-brand-dark/50 lg:backdrop-blur-xl border-t border-b lg:border border-white/5 lg:rounded-3xl p-4 md:p-8 lg:p-12 shadow-2xl relative overflow-hidden">

                        {/* Featured Image (Clear) */}
                        {post.cover_image && (
                            <div className="relative w-full aspect-video rounded-lg lg:rounded-2xl overflow-hidden mb-6 lg:mb-10 shadow-2xl border border-white/5 group">
                                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                        )}

                        {/* Excerpt */}
                        <div className="mb-6 lg:mb-8 p-3 lg:p-6 bg-brand-surface/50 border-l-4 border-brand-primary rounded-r-lg lg:rounded-r-xl">
                            <p className="text-sm md:text-xl font-medium text-brand-white/90 leading-relaxed italic font-serif">
                                "{post.excerpt}"
                            </p>
                        </div>

                        {/* Rich Content */}
                        <div className="mb-8 lg:mb-12">
                            <HTMLContent content={post.content} />
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 lg:my-10" />

                        {/* Tags & Footer */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-6">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <Tag className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-primary" />
                                    <span className="text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-widest">Tags:</span>
                                </div>
                                <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                                    {post.tags.map((t: any) => t.blog_tags && (
                                        <Link key={t.blog_tags.id} href={`/blog/tag/${t.blog_tags.slug}`}
                                            className="px-3 py-1 lg:px-4 lg:py-1.5 rounded-lg bg-brand-surface border border-brand-primary/10 text-gray-400 hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 text-xs lg:text-sm font-medium transition-all">
                                            #{t.blog_tags.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar: Recommended / TOC Placeholder */}
                    <div className="hidden lg:block lg:col-span-2">
                        {/* We can add a Table of Contents (TOC) here in the future */}
                        <div className="sticky top-32 space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                            {/* Placeholder for TOC */}
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Bottom Bar (Optional for better mobile UX) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-brand-surface/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
                <Link href="/blog" className="p-2 text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
                <div className="w-px h-4 bg-white/10" />
                <button className="p-2 text-brand-primary"><Share2 className="w-5 h-5" /></button>
            </div>

        </div>
    );
}
