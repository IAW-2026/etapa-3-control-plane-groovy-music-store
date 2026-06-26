export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8 animate-pulse">
            {/* HEADER SKELETON */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-3 w-full sm:w-1/2">
                    <div className="h-10 bg-muted rounded-lg w-3/4 md:w-1/2"></div>
                    <div className="h-6 bg-muted/60 rounded-lg w-1/2 md:w-1/3 mt-2"></div>
                    <div className="h-4 bg-muted/40 rounded-lg w-full max-w-lg mt-4"></div>
                </div>
                <div className="h-12 bg-muted rounded-xl w-full sm:w-40"></div>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN PRODUCTOS SKELETON */}
                <section className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-purple-500/50 rounded-full"></div>
                        <div className="h-8 bg-muted rounded-lg w-48 md:w-64"></div>
                    </div>
                    
                    {/* Falsa tabla */}
                    <div className="space-y-4">
                        {/* Cabecera de tabla falsa */}
                        <div className="hidden md:flex gap-4 border-b-2 border-border pb-4">
                            <div className="h-4 bg-muted/50 rounded w-1/4"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/4"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/4"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/4"></div>
                        </div>
                        {/* Filas falsas */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={`prod-${i}`} className="flex flex-col md:flex-row gap-4 py-3 border-b border-border/50">
                                <div className="h-5 bg-muted rounded w-full md:w-1/4"></div>
                                <div className="h-5 bg-muted rounded w-1/2 md:w-1/4"></div>
                                <div className="h-5 bg-muted rounded w-1/3 md:w-1/4"></div>
                                <div className="h-8 bg-muted rounded w-full md:w-1/4 mt-2 md:mt-0"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECCIÓN VENDEDORES SKELETON */}
                <section className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-orange-500/50 rounded-full"></div>
                        <div className="h-8 bg-muted rounded-lg w-56 md:w-72"></div>
                    </div>
                    
                    {/* Falsa tabla */}
                    <div className="space-y-4">
                        {/* Cabecera de tabla falsa */}
                        <div className="hidden md:flex gap-4 border-b-2 border-border pb-4">
                            <div className="h-4 bg-muted/50 rounded w-1/3"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/3"></div>
                            <div className="h-4 bg-muted/50 rounded w-1/3"></div>
                        </div>
                        {/* Filas falsas */}
                        {[1, 2, 3].map((i) => (
                            <div key={`vend-${i}`} className="flex flex-col md:flex-row gap-4 py-3 border-b border-border/50">
                                <div className="h-5 bg-muted rounded w-full md:w-1/3"></div>
                                <div className="h-5 bg-muted rounded w-3/4 md:w-1/3"></div>
                                <div className="h-5 bg-muted rounded w-1/2 md:w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}