'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { X, Save, Upload, Loader2, FileText, Tag, AlignLeft, Image as ImageIcon, Trash2, Code, Eye, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Quote, Undo, Redo, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TipTapUnderline from '@tiptap/extension-underline';

interface BlogEditorProps {
    initialData?: any;
    isEditing?: boolean;
    onClose?: () => void;
    onSave?: () => void;
}

interface Category {
    id: string;
    name: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-brand-surface border-b border-brand-primary/10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('bold') && "bg-brand-primary/10 text-brand-primary")}
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('italic') && "bg-brand-primary/10 text-brand-primary")}
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('underline') && "bg-brand-primary/10 text-brand-primary")}
            >
                <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('heading', { level: 1 }) && "bg-brand-primary/10 text-brand-primary")}
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('heading', { level: 2 }) && "bg-brand-primary/10 text-brand-primary")}
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('bulletList') && "bg-brand-primary/10 text-brand-primary")}
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('orderedList') && "bg-brand-primary/10 text-brand-primary")}
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
                onClick={setLink}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('link') && "bg-brand-primary/10 text-brand-primary")}
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary", editor.isActive('blockquote') && "bg-brand-primary/10 text-brand-primary")}
            >
                <Quote className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={cn("p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary")}
            >
                <Minus className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary disabled:opacity-50"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-1.5 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-brand-primary disabled:opacity-50"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};


export default function BlogEditor({ initialData, isEditing = false, onClose, onSave }: BlogEditorProps) {
    const router = useRouter();
    const supabase = createClient();

    // Core State
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status === 'published' ? 'published' : 'draft');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.category_id ? [initialData.category_id] : []);

    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredImage, setFeaturedImage] = useState<string | null>(initialData?.cover_image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Editor Mode
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [content, setContent] = useState(initialData?.content || '');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Tiptap Editor
    const extensions = useMemo(() => [
        StarterKit,
        TipTapImage,
        TipTapLink.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-brand-primary underline decoration-brand-primary/50 hover:decoration-brand-primary transition-all',
            },
        }),
        TipTapUnderline,
        Placeholder.configure({
            placeholder: 'Write something amazing...',
        }),
    ], []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: extensions,
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-4 lg:px-6 text-brand-white',
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    // Update editor content when switching back from source mode
    useEffect(() => {
        if (!isSourceMode && editor) {
            // Only update if content is different to avoid cursor jumps / loops
            if (editor.getHTML() !== content) {
                editor.commands.setContent(content);
            }
        }
    }, [isSourceMode, content, editor]);


    useEffect(() => {
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Slug Auto-gen
    const createSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    useEffect(() => {
        if (title && !isEditing && !initialData) {
            setSlug(createSlug(title));
        }
    }, [title, isEditing, initialData]);

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setCategories((data || []).map((cat: any) => ({ id: cat.id, name: cat.name })));
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = async () => {
        if (confirm('Remove featured image?')) {
            setFeaturedImage(null);
            setImagePreview(null);
            setImageFile(null);
        }
    };

    const handleSavePost = async () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }
        if (selectedCategories.length === 0) {
            alert('Please select a category');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Image Upload
            let coverUrl = featuredImage;
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                // Remove redundant folder prefix if bucket is already specified
                const filePath = fileName;

                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('blog-media')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Upload error details:', uploadError);
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }

                const { data: urlData } = supabase.storage
                    .from('blog-media')
                    .getPublicUrl(filePath);

                coverUrl = urlData.publicUrl;
            }

            const postData: any = {
                title: title.trim(),
                slug: slug || createSlug(title),
                content,
                excerpt: excerpt.trim(),
                cover_image: coverUrl,
                status: status,
                category_id: selectedCategories[0],
                author_id: user.id,
                updated_at: new Date().toISOString(),
            };

            if (status === 'published' && (!initialData?.published_at)) {
                postData.published_at = new Date().toISOString();
            }

            let result;
            if (isEditing && initialData?.id) {
                result = await supabase.from('blog_posts').update(postData).eq('id', initialData.id).select().single();
            } else {
                result = await supabase.from('blog_posts').insert(postData).select().single();
            }

            if (result.error) throw result.error;

            if (onSave) onSave();
            else {
                router.push('/blog-panel/posts');
                router.refresh();
            }

        } catch (error: any) {
            console.error('Error saving post:', error);
            alert('Failed to save: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleCategory = (catId: string) => {
        setSelectedCategories([catId]);
    };

    const handleClose = () => {
        if (onClose) onClose();
        else router.back();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-brand-darker text-brand-white -m-3 sm:-m-4 md:-m-6 lg:-m-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-brand-primary/10 bg-brand-surface shrink-0 z-10">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleClose}
                        className="p-1.5 -ml-1.5 rounded-lg hover:bg-brand-primary/10 text-gray-400 hover:text-brand-primary transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
                        <h2 className="text-lg font-bold text-brand-white font-display truncate">
                            {isEditing ? 'Edit Post' : 'New Post'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                status === 'published' ? "bg-brand-primary" : "bg-yellow-500"
                            )} />
                            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium whitespace-nowrap">
                                {status === 'published' ? 'Published' : 'Draft'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end w-full sm:w-auto gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="hidden sm:inline-flex text-xs h-8 text-gray-400 hover:text-brand-white hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSavePost}
                        disabled={saving}
                        className="w-full sm:w-auto flex-1 sm:flex-none h-9 text-xs sm:text-sm bg-brand-primary text-black hover:bg-brand-secondary hover:text-white transition-all font-bold"
                    >
                        {saving ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" /> : <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />}
                        {isEditing ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

                    {/* Main Metadata Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column: Main Inputs */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter post title..."
                                    className="w-full bg-transparent text-2xl lg:text-4xl font-bold text-brand-white placeholder:text-gray-600 focus:outline-none border-none p-0"
                                />
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-mono text-brand-primary">slug:</span>
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(createSlug(e.target.value))}
                                        className="bg-transparent text-gray-400 focus:text-brand-white focus:outline-none border-b border-dashed border-gray-700 focus:border-brand-primary transition-colors flex-1"
                                    />
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden min-h-[500px] flex flex-col">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-brand-primary/10 bg-black/20">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Content</span>
                                    <div className="flex bg-black/40 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setIsSourceMode(false)}
                                            className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5", !isSourceMode ? "bg-brand-primary text-black shadow-sm" : "text-gray-400 hover:text-brand-white")}
                                        >
                                            <Eye className="w-3 h-3" /> Visual
                                        </button>
                                        <button
                                            onClick={() => setIsSourceMode(true)}
                                            className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5", isSourceMode ? "bg-brand-primary text-black shadow-sm" : "text-gray-400 hover:text-brand-white")}
                                        >
                                            <Code className="w-3 h-3" /> Source
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 relative bg-brand-dark/50 flex flex-col">
                                    {isSourceMode ? (
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none bg-transparent text-gray-300 leading-relaxed min-h-[400px]"
                                            placeholder="Paste your HTML code here..."
                                        />
                                    ) : (
                                        <>
                                            <MenuBar editor={editor} />
                                            <EditorContent editor={editor} className="flex-1" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Settings */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Publish Settings */}
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-5 space-y-4">
                                <h3 className="text-sm font-bold text-brand-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-brand-primary" />
                                    Publishing
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setStatus('draft')}
                                                className={cn("py-2 rounded-lg text-xs font-bold transition-all border", status === 'draft' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50" : "bg-black/20 text-gray-500 border-transparent hover:bg-black/40")}
                                            >
                                                DRAFT
                                            </button>
                                            <button
                                                onClick={() => setStatus('published')}
                                                className={cn("py-2 rounded-lg text-xs font-bold transition-all border", status === 'published' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/50" : "bg-black/20 text-gray-500 border-transparent hover:bg-black/40")}
                                            >
                                                PUBLISHED
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organization */}
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-5 space-y-4">
                                <h3 className="text-sm font-bold text-brand-white flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-brand-primary" />
                                    Organization
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => toggleCategory(cat.id)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                                        selectedCategories.includes(cat.id)
                                                            ? "bg-brand-primary text-black border-brand-primary"
                                                            : "bg-black/20 text-gray-400 border-white/5 hover:border-white/20"
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                        {categories.length === 0 && <p className="text-xs text-gray-600 italic">No categories found.</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Excerpt</label>
                                        <textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            rows={4}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-brand-white placeholder:text-gray-600 focus:border-brand-primary focus:outline-none resize-none"
                                            placeholder="Write a short excerpt..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-5 space-y-4">
                                <h3 className="text-sm font-bold text-brand-white flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-brand-primary" />
                                    Featured Image
                                </h3>

                                <div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    {(featuredImage || imagePreview) ? (
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden group border border-white/10">
                                            <Image src={imagePreview || featuredImage || ''} alt="Cover" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-brand-white text-black rounded-lg hover:scale-105 transition-transform"><Upload className="w-4 h-4" /></button>
                                                <button onClick={handleDeleteImage} className="p-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-brand-primary/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group">
                                            <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-medium">Click to upload cover</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
