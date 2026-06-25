export const metadata = {
    title: 'Gestión de Vendedores - Control Plane',
    description: 'Panel de administración global para el catálogo y vendedores de la Seller App.',
};

export default function SellerPage() {
    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            {/* ENCABEZADO */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-purple-600 text-xl md:text-2xl font-medium mt-1">Seller App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Control operativo del catálogo de productos y gestión de vendedores del ecosistema.
                    </p>
                </div>
                
                <a 
                    href="#" // TODO: Actualizar con la URL real del panel de la Seller App
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel de administración externo de la Seller App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto opacity-70 cursor-not-allowed"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN DE PRODUCTOS / CATÁLOGO (En construcción) */}
                <section aria-labelledby="productos-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="productos-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" aria-hidden="true"></span>
                            Catálogo de Productos
                        </h2>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                        <svg className="w-12 h-12 text-foreground/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="font-syne text-lg font-bold text-foreground">Sección en construcción</h3>
                        <p className="font-dm text-sm text-foreground/60 mt-1 max-w-sm">
                            Próximamente podrás visualizar y gestionar los productos ofrecidos por los vendedores desde aquí.
                        </p>
                    </div>
                </section>

                {/* SECCIÓN DE VENDEDORES (En construcción) */}
                <section aria-labelledby="vendedores-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="vendedores-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block" aria-hidden="true"></span>
                            Vendedores Registrados
                        </h2>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                        <svg className="w-12 h-12 text-foreground/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="font-syne text-lg font-bold text-foreground">Sección en construcción</h3>
                        <p className="font-dm text-sm text-foreground/60 mt-1 max-w-sm">
                            El módulo de administración de cuentas de vendedores estará disponible en la próxima actualización.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}