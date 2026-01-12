import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog | Our Cashmir',
    description: 'Insights, updates, and stories from our team.',
};

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
    const supabase = await createClient();
    const page = Number(searchParams.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    // Fetch Published Posts
    const { data: posts, count, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name, slug)', { count: 'exact' })
        .eq('status', 'published')
        // .lte('published_at', new Date().toISOString()) // Only if published_at used strictly
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error(error);
        return <div>Error loading blog</div>;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;
    const featuredPost = posts && posts.length > 0 ? posts[0] : null;
    const regularPosts = posts && posts.length > 0 ? posts.slice(1) : [];

    return (
        <div className="min-h-screen bg-brand-darker text-brand-white">
            {/* Header / Hero */}
            <div className="bg-brand-surface border-b border-brand-primary/10 pt-20 pb-8 lg:pt-32 lg:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-white to-gray-400">
                        Our Blog
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                        Latest news, industry insights, and marketing strategies to supercharge your brand.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Featured Post */}
                {page === 1 && featuredPost && (
                    <div className="mb-10 lg:mb-16">
                        <h2 className="text-xs lg:text-sm font-bold text-brand-primary uppercase tracking-widest mb-4 lg:mb-6">Featured Story</h2>
                        <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                            <div className="aspect-video relative rounded-xl lg:rounded-2xl overflow-hidden border border-white/5 group-hover:border-brand-primary/20 transition-all bg-brand-dark">
                                {featuredPost.cover_image && (
                                    <img src={featuredPost.cover_image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    {featuredPost.blog_categories && (
                                        <span className="text-brand-primary font-medium">{featuredPost.blog_categories.name}</span>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(featuredPost.published_at!).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold group-hover:text-brand-primary transition-colors leading-tight">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-gray-400 text-lg line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                                <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                                    Read Article <ArrowRight size={18} />
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {regularPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                        {regularPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-brand-surface/30 border border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/20 hover:bg-brand-surface/50 transition-all duration-300">
                                <div className="aspect-[16/10] bg-brand-dark overflow-hidden relative">
                                    {post.cover_image ? (
                                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-brand-darker">No Image</div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                        {post.blog_categories && (
                                            <span className="text-brand-primary font-medium capitalize">{post.blog_categories.name}</span>
                                        )}
                                        {post.blog_categories && <span>•</span>}
                                        <span>{new Date(post.published_at!).toLocaleDateString()}</span>
                                    </div>
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
                    </div>
                ) : (
                    page === 1 && !featuredPost && (
                        <div className="text-center py-20 text-gray-500">
                            No posts published yet. Check back soon!
                        </div>
                    )
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-16">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                href={`/blog?page=${p}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${p === page
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface border border-brand-primary/10 text-gray-400 hover:text-white hover:border-brand-primary/30'
                                    }`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
