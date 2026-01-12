'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Loader2, Tag } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const supabase = createClient();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blog_categories')
            .select('*')
            .order('name');

        if (error) console.error(error);
        if (data) setCategories(data);
        setLoading(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewName(name);
        // Auto-generate slug
        setNewSlug(name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!newName || !newSlug) return;

        setCreating(true);
        const { data, error } = await supabase
            .from('blog_categories')
            .insert([{ name: newName, slug: newSlug }])
            .select()
            .single();

        if (error) {
            setError(error.message);
        } else if (data) {
            setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName('');
            setNewSlug('');
        }
        setCreating(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might affect posts using this category.')) return;

        const { error } = await supabase
            .from('blog_categories')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting category: ' + error.message);
        } else {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-brand-white mb-4">Add New Category</h3>
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={handleNameChange}
                            placeholder="e.g. Technology"
                            className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-primary/50"
                            required
                        />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Slug</label>
                        <input
                            type="text"
                            value={newSlug}
                            onChange={(e) => setNewSlug(e.target.value)}
                            placeholder="e.g. technology"
                            className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-primary/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={creating || !newName}
                        className="mt-6 h-10 px-6 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {creating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                        Add
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>

            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-brand-primary/10 bg-brand-dark/20 flex justify-between items-center">
                    <h3 className="font-semibold text-brand-white">Existing Categories</h3>
                    <span className="text-xs text-gray-400">{categories.length} categories</span>
                </div>
                <div className="divide-y divide-brand-primary/5">
                    {loading ? (
                        <div className="p-8 flex justify-center text-brand-primary">
                            <Loader2 className="animate-spin" size={24} />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No categories yet. Create one above.
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                <div>
                                    <div className="font-medium text-brand-white flex items-center gap-2">
                                        <Tag size={14} className="text-brand-primary" />
                                        {cat.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">/{cat.slug}</div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
