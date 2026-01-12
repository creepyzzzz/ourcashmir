'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from 'lucide-react';

export default function MediaManager() {
    const [files, setFiles] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const BUCKET = 'blog-media';

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.storage.from(BUCKET).list();
        if (data) {
            setFiles(data);
        }
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);

        if (error) {
            alert('Error uploading: ' + error.message);
        } else {
            fetchFiles();
        }
        setUploading(false);
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.storage.from(BUCKET).remove([fileName]);
        if (!error) fetchFiles();
    };

    const copyUrl = (fileName: string) => {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        navigator.clipboard.writeText(data.publicUrl);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-8 border-dashed flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                </div>
                <div>
                    <h3 className="font-bold text-brand-white text-lg">Upload Media</h3>
                    <p className="text-gray-400 text-sm mt-1">Drag & drop or click to upload</p>
                </div>
                <input
                    type="file"
                    onChange={handleUpload}
                    accept="image/*"
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files.map(file => {
                    const { data } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
                    return (
                        <div key={file.id} className="group relative bg-brand-dark rounded-lg overflow-hidden border border-white/5 aspect-square">
                            <img src={data.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => copyUrl(file.name)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm"
                                    title="Copy URL"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(file.name)}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
