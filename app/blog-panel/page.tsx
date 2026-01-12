import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, CheckCircle, Edit3, Clock, Plus, ArrowRight } from 'lucide-react';

export default async function BlogDashboard() {
    const supabase = await createClient();

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'blog_poster')) {
        // redirect('/'); // Or show unauthorized
        // Ideally redirect to a "Not Authorized" page, but redirecting to home is safe for now
    }

    // Fetch Stats
    // Using count queries appropriately
    const { count: totalPosts } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
    const { count: publishedPosts } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { count: draftPosts } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft');
    const { count: scheduledPosts } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'scheduled');

    // Fetch Recent Posts
    const { data: recentPosts } = await supabase
        .from('blog_posts')
        .select('id, title, status, published_at, created_at, view_count')
        .order('created_at', { ascending: false })
        .limit(5);

    const stats = [
        { label: 'Total Posts', value: totalPosts || 0, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Published', value: publishedPosts || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Drafts', value: draftPosts || 0, icon: Edit3, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Scheduled', value: scheduledPosts || 0, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-white">Dashboard Overview</h1>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Welcome back to the content engine.</p>
                    </div>
                    <Link
                        href="/blog-panel/posts/create"
                        className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        Create New Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-brand-surface border border-brand-primary/10 rounded-xl p-4 hover:border-brand-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl sm:text-2xl font-bold text-brand-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-2 sm:p-3 rounded-lg ${stat.bg} ${stat.color} self-end sm:self-center`}>
                                <stat.icon size={16} className="sm:w-5 sm:h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Posts & Quick Actions Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Posts */}
                <div className="lg:col-span-2 bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-bold text-brand-white">Recent Posts</h2>
                        <Link href="/blog-panel/posts" className="text-xs sm:text-sm text-brand-primary hover:text-brand-primary/80 flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {recentPosts && recentPosts.length > 0 ? (
                            recentPosts.map(post => (
                                <div key={post.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors border border-white/5">
                                    <div className="min-w-0 pr-4">
                                        <h3 className="text-sm sm:text-base font-medium text-brand-white truncate">{post.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-gray-500">
                                            <span className={`px-1.5 py-0.5 rounded-full capitalize ${post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                                                post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    post.status === 'scheduled' ? 'bg-purple-500/10 text-purple-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                {post.status}
                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{new Date(post.created_at || '').toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Link href={`/blog-panel/posts/create?id=${post.id}&edit=true`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0">
                                        <Edit3 size={16} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No posts yet. Start writing!
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Tips / System Status */}
                <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-4 sm:p-6 mb-8 lg:mb-0">
                    <h2 className="text-base sm:text-lg font-bold text-brand-white mb-4">System Status</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Database</span>
                            <span className="text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Connected</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Storage</span>
                            <span className="text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Operational</span>
                        </div>
                        <div className="p-4 mt-6 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                            <h3 className="text-brand-primary font-medium text-sm mb-1">Tip</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Use tags to organize your content for better SEO and user navigation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
