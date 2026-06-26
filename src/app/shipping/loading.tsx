export default function LoadingShipping() {
    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8" aria-hidden="true">
            {/* ENCABEZADO SKELETON */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border animate-pulse">
                <div className="space-y-3 w-full">
                    {/* Título */}
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 max-w-[300px]"></div>
                    {/* Subtítulo */}
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 max-w-[200px]"></div>
                    {/* Descripción */}
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full max-w-[500px] mt-4"></div>
                </div>
                
                {/* Botón Panel Externo (Terracota) */}
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:w-[160px]"></div>
            </header>

            {/* CONTENIDO OPERATIVO SKELETON */}
            <div className="space-y-10 animate-pulse">
                
                {/* SECCIÓN 1: ENVÍOS (Píldora Azul) */}
                <section className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-200 dark:bg-blue-900 rounded-full"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-64"></div>
                    </div>
                    <TablaSkeleton columnas={6} filasDesktop={5} filasMovil={3} />
                </section>

                {/* SECCIÓN 2: EMPRESAS (Píldora Índigo) */}
                <section className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-indigo-200 dark:bg-indigo-900 rounded-full"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-56"></div>
                    </div>
                    <TablaSkeleton columnas={4} filasDesktop={4} filasMovil={2} />
                </section>

                {/* SECCIÓN 3: OPERADORES (Píldora Verde Azulado) */}
                <section className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-teal-200 dark:bg-teal-900 rounded-full"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-72"></div>
                    </div>
                    <TablaSkeleton columnas={4} filasDesktop={4} filasMovil={2} />
                </section>

            </div>
        </main>
    );
}

// Subcomponente interno para generar las tablas falsas rápido y sin repetir código
function TablaSkeleton({ columnas, filasDesktop, filasMovil }: { columnas: number, filasDesktop: number, filasMovil: number }) {
    return (
        <div className="space-y-6">
            {/* VISTA DESKTOP SKELETON */}
            <div className="overflow-x-auto hidden md:block">
                <div className="w-full text-left border-collapse">
                    {/* Cabecera */}
                    <div className="flex border-b border-border pb-4 mb-4 bg-muted/10 p-4 rounded-t-lg">
                        {Array.from({ length: columnas }).map((_, i) => (
                            <div key={`th-${i}`} className="flex-1">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                    {/* Filas */}
                    <div className="space-y-4 px-4">
                        {Array.from({ length: filasDesktop }).map((_, filaIdx) => (
                            <div key={`tr-${filaIdx}`} className="flex border-b border-border/50 pb-4">
                                {Array.from({ length: columnas }).map((_, colIdx) => (
                                    <div key={`td-${filaIdx}-${colIdx}`} className="flex-1">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 max-w-[120px]"></div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* VISTA MÓVIL SKELETON */}
            <div className="md:hidden space-y-4">
                {Array.from({ length: filasMovil }).map((_, i) => (
                    <div key={`mob-${i}`} className="bg-card border-2 border-slate-200 dark:border-slate-800 h-36 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between">
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
                        </div>
                        <div className="border-t border-border pt-4 space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN SKELETON */}
            <div className="flex items-center justify-between border-t border-border pt-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32 hidden sm:block"></div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="flex-1 sm:flex-none h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}