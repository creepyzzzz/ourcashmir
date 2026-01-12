import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Edit3, Trash2, Archive, Eye } from 'lucide-react';
import DeletePostButton from '@/components/blog-panel/DeletePostButton';
import { redirect } from 'next/navigation';

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const page = Number(params.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const query = params.query?.toString() || '';
    const status = params.status?.toString() || 'all';

    // Build Query
    let dbQuery = supabase
        .from('blog_posts')
        .select('*, blog_categories(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`);
    }
    if (status !== 'all') {
        dbQuery = dbQuery.eq('status', status);
    }

    const { data: posts, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching posts:', error);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-white">All Posts</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and publish your blog content.</p>
                </div>
                <Link
                    href="/blog-panel/posts/create"
                    className="inline-flex items-center gap-2 bg-brand-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Create New
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <form action="/blog-panel/posts" method="get">
                        <input
                            name="query"
                            defaultValue={query}
                            placeholder="Search posts..."
                            className="w-full bg-brand-dark/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                        {/* Preserve other params */}
                        {status !== 'all' && <input type="hidden" name="status" value={status} />}
                    </form>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'published', 'draft', 'scheduled', 'archived'].map((s) => (
                        <Link
                            key={s}
                            href={`/blog-panel/posts?status=${s}${query ? `&query=${query}` : ''}`}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${status === s
                                ? 'bg-brand-primary text-white'
                                : 'bg-brand-dark/50 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                        <thead>
                            <tr className="border-b border-brand-primary/10 bg-brand-dark/20 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="p-4 font-semibold w-1/2 sm:w-auto">Title</th>
                                <th className="p-4 font-semibold hidden sm:table-cell">Status</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Category</th>
                                <th className="p-4 font-semibold hidden lg:table-cell">Date</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-primary/5 text-sm">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <tr key={post.id} className="group hover:bg-brand-primary/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-brand-white truncate max-w-[200px] sm:max-w-md">
                                                {post.title}
                                            </div>
                                            <div className="flex items-center gap-2 sm:hidden mt-2">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                                                    post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        post.status === 'scheduled' ? 'bg-purple-500/10 text-purple-500' :
                                                            'bg-gray-500/10 text-gray-500'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5 hidden sm:block">{post.slug}</div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                                                post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    post.status === 'scheduled' ? 'bg-purple-500/10 text-purple-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 hidden md:table-cell">
                                            {post.blog_categories?.name || 'Uncategorized'}
                                        </td>
                                        <td className="p-4 text-gray-500 hidden lg:table-cell">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString()
                                                : <span className="text-gray-600">--</span>
                                            }
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Link href={`/blog-panel/posts/create?id=${post.id}&edit=true`} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg">
                                                    <Edit3 size={16} />
                                                </Link>
                                                <DeletePostButton postId={post.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No posts found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-brand-primary/10 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, count || 0)} of {count} results
                        </div>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <Link
                                    href={`/blog-panel/posts?page=${page - 1}&status=${status}&query=${query}`}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-brand-dark hover:bg-white/10 rounded-lg border border-brand-primary/10 transition-colors"
                                >
                                    Previous
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link
                                    href={`/blog-panel/posts?page=${page + 1}&status=${status}&query=${query}`}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-brand-dark hover:bg-white/10 rounded-lg border border-brand-primary/10 transition-colors"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
