import MediaManager from '@/components/blog-panel/MediaManager';

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-white">Media Library</h1>
                <p className="text-gray-400 text-sm mt-1">Manage images and assets for your blog.</p>
            </div>
            <MediaManager />
        </div>
    );
}
