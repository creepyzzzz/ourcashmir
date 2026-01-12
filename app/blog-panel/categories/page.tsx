import CategoryManager from '@/components/blog-panel/CategoryManager';

export default function CategoriesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-white">Categories</h1>
                <p className="text-gray-400 text-sm mt-1">Organize your posts with categories.</p>
            </div>
            <CategoryManager />
        </div>
    );
}
