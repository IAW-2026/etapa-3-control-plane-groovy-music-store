export default function TablaPayoutsSkeleton() {
    return (
        <div className="space-y-4 font-dm animate-pulse">
            {/* CABECERA FALSA */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-border bg-muted/20">
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-20" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-28 ml-auto" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-28 ml-auto" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-16 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={`payout-sk-${i}`}>
                                <td className="p-4">
                                    <div className="h-4 bg-muted rounded w-56" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-muted rounded w-24 ml-auto" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-muted rounded w-24 ml-auto" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-muted rounded w-20 ml-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL SKELETON */}
            <div className="md:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={`payout-sk-m-${i}`} className="bg-background border border-border p-4 rounded-xl shadow-sm space-y-3">
                        <div>
                            <div className="h-2.5 bg-muted/50 rounded w-16 mb-1.5" />
                            <div className="h-4 bg-muted rounded w-48" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                            <div>
                                <div className="h-2 bg-muted/50 rounded w-12 mb-1" />
                                <div className="h-4 bg-muted rounded w-16" />
                            </div>
                            <div>
                                <div className="h-2 bg-muted/50 rounded w-14 mb-1" />
                                <div className="h-4 bg-muted rounded w-16" />
                            </div>
                            <div>
                                <div className="h-2 bg-muted/50 rounded w-10 mb-1" />
                                <div className="h-4 bg-muted rounded w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN SKELETON */}
            <div className="flex items-center justify-between border-t border-border pt-4 px-1">
                <div className="h-4 bg-muted rounded w-40" />
                <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded-lg w-24" />
                    <div className="h-8 bg-muted rounded-lg w-24" />
                </div>
            </div>
        </div>
    )
}
