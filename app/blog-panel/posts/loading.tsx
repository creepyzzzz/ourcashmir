export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-brand-surface animate-pulse rounded-lg" />
                <div className="h-10 w-28 bg-brand-surface animate-pulse rounded-lg" />
            </div>
            <div className="h-14 w-full bg-brand-surface animate-pulse rounded-xl" />
            <div className="h-96 w-full bg-brand-surface animate-pulse rounded-xl" />
        </div>
    )
}
