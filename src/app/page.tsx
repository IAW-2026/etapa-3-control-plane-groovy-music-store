import { Suspense } from "react";
import Link from "next/link";
import { fetchShipping, fetchBuyer, fetchSeller, fetchPayments } from "@/lib/clientesApi";

export const revalidate = 1;

export const metadata = {
    title: 'Dashboard - Control Plane',
    description: 'Panel principal del ecosistema Groovy Music Store.',
};

export default function DashboardPage() {
    return (
        <main className="max-w-7xl mx-auto space-y-4 p-4 md:p-6">
            {/* ENCABEZADO  */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
                <div className="space-y-1">
                    <h1 className="font-syne text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Panel de Control Global
                        <span className="block text-primary-dark text-lg md:text-xl font-medium">Ecosistema Groovy</span>
                    </h1>
                    <p className="font-dm text-xs md:text-sm text-foreground/80 max-w-lg">
                        Visión consolidada y estado operativo de todos los microservicios.
                    </p>
                </div>
                
                <div className="hidden sm:flex items-center gap-2 font-dm text-xs text-foreground/80 bg-muted/30 px-3 py-1.5 rounded-lg border border-border">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Sistemas Online
                </div>
            </header>

            {/* GRILLA DE METRICAS 2x2 COMPACTA */}
            <section aria-labelledby="metricas-heading">
                <h2 id="metricas-heading" className="sr-only">Métricas Generales</h2>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <Suspense fallback={<CardSkeleton titulo="Envíos Activos" />}>
                        <ShippingStats />
                    </Suspense>

                    <Suspense fallback={<CardSkeleton titulo="Compradores" />}>
                        <BuyerStats />
                    </Suspense>

                    <Suspense fallback={<CardSkeleton titulo="Catálogo" />}>
                        <SellerStats />
                    </Suspense>

                    <Suspense fallback={<CardSkeleton titulo="Transacciones" />}>
                        <PaymentsStats />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}

// --- COMPONENTES ASÍNCRONOS CON VALIDACIÓN ESTRICTA ---

async function ShippingStats() {
    try {
        const respuesta = await fetchShipping<{ datos: any[] }>('/api/shipments?estado=pendiente');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de respuesta inválido");
        }

        return (
            <StatCard 
                titulo="Envíos Activos" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Pendientes de despacho"
                linkHref="/shipping"
                appName="Shipping App"
                colorBadge="bg-blue-500/10 text-blue-800"
                iconColor="bg-blue-500"
            />
        );
    } catch (error: any) {
        console.error("[Shipping Error]:", error.message);
        return <ErrorCard titulo="Envíos Activos" appName="Shipping App" linkHref="/shipping" errorMsg={error.message} />;
    }
}

async function BuyerStats() {
    try {
        const respuesta = await fetchBuyer<{ datos: any[] }>('/api/users');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de respuesta inválido");
        }

        return (
            <StatCard 
                titulo="Compradores" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Usuarios registrados"
                linkHref="/buyer"
                appName="Buyer App"
                colorBadge="bg-emerald-500/10 text-emerald-800"
                iconColor="bg-emerald-500"
            />
        );
    } catch (error: any) {
        console.error("[Buyer Error]:", error.message);
        return <ErrorCard titulo="Compradores" appName="Buyer App" linkHref="/buyer" errorMsg={error.message} />;
    }
}

async function SellerStats() {
    try {
        const respuesta = await fetchSeller<{ datos: any[] }>('/api/products');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de respuesta inválido");
        }

        return (
            <StatCard 
                titulo="Productos" 
                valor={respuesta.datos.length.toString()} 
                subtexto="En el catálogo global"
                linkHref="/seller"
                appName="Seller App"
                colorBadge="bg-purple-500/10 text-purple-800"
                iconColor="bg-purple-500"
            />
        );
    } catch (error: any) {
        console.error("[Seller Error]:", error.message);
        return <ErrorCard titulo="Productos" appName="Seller App" linkHref="/seller" errorMsg={error.message} />;
    }
}

async function PaymentsStats() {
    try {
        const respuesta = await fetchPayments<{ datos: any[] }>('/api/payments');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de respuesta inválido");
        }

        return (
            <StatCard 
                titulo="Transacciones" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Operaciones monetarias"
                linkHref="/payments"
                appName="Payments App"
                colorBadge="bg-orange-500/10 text-orange-900"
                iconColor="bg-orange-500"
            />
        );
    } catch (error: any) {
        console.error("[Payments Error]:", error.message);
        return <ErrorCard titulo="Transacciones" appName="Payments App" linkHref="/payments" errorMsg={error.message} />;
    }
}

// --- COMPONENTES DE INTERFAZ DE USUARIO (UI) ---

interface StatCardProps {
    titulo: string;
    valor: string;
    subtexto: string;
    linkHref: string;
    appName: string;
    colorBadge: string;
    iconColor: string;
}

function StatCard({ titulo, valor, subtexto, linkHref, appName, colorBadge, iconColor }: StatCardProps) {
    return (
        <div className="bg-card rounded-xl p-4 md:p-5 shadow-sm border border-border flex flex-col hover:shadow-md transition-all hover:-translate-y-1 relative group">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-dm text-[11px] md:text-xs font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-3.5 rounded-full ${iconColor}`}></span>
                    {titulo}
                </h3>
                <span className={`font-dm text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md ${colorBadge}`}>
                    {appName}
                </span>
            </div>
            
            <div className="font-syne text-3xl md:text-4xl font-bold text-foreground mb-0.5 tracking-tight">
                {valor}
            </div>
            <p className="font-dm text-xs md:text-sm text-foreground/80 mb-3">
                {subtexto}
            </p>
            
            <div className="mt-auto border-t border-border pt-3">
                <Link 
                    href={linkHref}
                    className="inline-flex items-center font-dm text-xs md:text-sm text-primary-dark font-bold hover:text-primary transition-colors"
                    aria-label={`Ver detalle de ${titulo} en la aplicación ${appName}`}
                >
                    Ver detalle 
                    <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

function ErrorCard({ titulo, appName, linkHref, errorMsg }: { titulo: string, appName: string, linkHref: string, errorMsg?: string }) {
    return (
        <div className="bg-red-50/30 rounded-xl p-4 md:p-5 shadow-sm border border-red-100 flex flex-col relative overflow-hidden h-full">
            <div className="flex justify-between items-start mb-2 opacity-70">
                <h3 className="font-dm text-[11px] md:text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-3.5 rounded-full bg-red-400"></span>
                    {titulo}
                </h3>
                <span className="font-dm text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-700">
                    {appName}
                </span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1.5">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <span className="font-dm text-xs md:text-sm font-bold text-red-700 mb-0.5">Conexión Fallida</span>
                {errorMsg && (
                    <span className="font-dm text-[10px] md:text-xs text-red-600/80 max-w-full truncate px-2" title={errorMsg}>
                        {errorMsg}
                    </span>
                )}
            </div>
            
            <div className="mt-auto border-t border-red-100 pt-3 text-center">
                <Link 
                    href={linkHref}
                    className="inline-flex items-center font-dm text-xs md:text-sm text-red-700 font-bold hover:text-red-800 transition-colors"
                >
                    Forzar recarga &rarr;
                </Link>
            </div>
        </div>
    );
}

function CardSkeleton({ titulo }: { titulo: string }) {
    return (
        <div className="bg-card rounded-xl p-4 md:p-5 shadow-sm border border-border flex flex-col animate-pulse min-h-[150px]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-dm text-[11px] md:text-xs font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-3.5 rounded-full bg-muted"></div>
                    {titulo}
                </h3>
                <div className="h-5 w-16 bg-muted rounded-md"></div>
            </div>
            <div className="h-8 w-12 bg-muted rounded-lg mb-2"></div>
            <div className="h-3 w-2/3 bg-muted rounded mb-auto"></div>
            <div className="mt-3 border-t border-border pt-3">
                <div className="h-3 w-20 bg-muted rounded"></div>
            </div>
        </div>
    );
}