export function DisputasSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-dm animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={`disp-sk-${i}`} className="bg-background border border-border rounded-xl p-5 shadow-sm">
                    <div className="h-3 bg-muted/60 rounded w-24 mb-3" />
                    <div className="h-8 bg-muted rounded w-16" />
                </div>
            ))}
        </div>
    )
}

export function TransaccionesSkeleton() {
    return (
        <div className="space-y-4 font-dm animate-pulse">
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-border bg-muted/20">
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-20" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-24" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-24" /></th>
                            <th className="p-4"><div className="h-3 bg-muted/60 rounded w-20 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={`tx-sk-${i}`}>
                                <td className="p-4"><div className="h-4 bg-muted rounded w-48" /></td>
                                <td className="p-4"><div className="h-5 bg-muted rounded-full w-20" /></td>
                                <td className="p-4"><div className="h-4 bg-muted rounded w-20" /></td>
                                <td className="p-4"><div className="h-4 bg-muted rounded w-20 ml-auto" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={`tx-sk-m-${i}`} className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
                        <div className="flex justify-between">
                            <div className="h-4 bg-muted rounded w-32" />
                            <div className="h-5 bg-muted rounded w-20" />
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between">
                            <div className="h-4 bg-muted rounded-full w-16" />
                            <div className="h-3 bg-muted rounded w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
