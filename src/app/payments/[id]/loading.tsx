export default function Loading() {
    return (
        <div className="max-w-md animate-pulse space-y-3">
            <div className="h-4 w-20 bg-card rounded" />
            <div className="h-8 w-40 bg-card rounded mb-4" />
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <div className="h-3 w-16 bg-border rounded" />
                        <div className="h-4 w-32 bg-border rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}