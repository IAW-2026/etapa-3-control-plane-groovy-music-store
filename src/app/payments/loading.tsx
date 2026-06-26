export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-9 w-32 bg-card rounded mb-6" />
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <tbody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <tr key={i} className="border-b border-border">
                                <td className="py-3"><div className="h-4 w-24 bg-card rounded" /></td>
                                <td className="py-3"><div className="h-4 w-20 bg-card rounded" /></td>
                                <td className="py-3"><div className="h-4 w-16 bg-card rounded" /></td>
                                <td className="py-3"><div className="h-4 w-20 bg-card rounded" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}