import TagManager from '@/components/blog-panel/TagManager';

export default function TagsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-white">Tags</h1>
                <p className="text-gray-400 text-sm mt-1">Manage content tags for better discovery.</p>
            </div>
            <TagManager />
        </div>
    );
}
