import { Suspense } from "react";
import Link from "next/link";
import { fetchShipping, fetchBuyer, fetchSeller, fetchPayments } from "@/lib/clientesApi";

export const metadata = {
    title: 'Dashboard - Control Plane',
}

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="font-syne m-0 text-3xl md:text-4xl font-semibold text-foreground">
                    Panel de Control Global
                </h1>
                <p className="font-dm mt-2 mb-0 text-foreground/80 text-base">
                    Visión consolidada del ecosistema Groovy Music Store.
                </p>
                <div className="w-16 h-1 bg-primary mt-4 rounded-full"></div>
            </header>

            {/* GRILLA DE METRICAS CENTRALIZADA */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
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
        </div>
    );
}

// --- COMPONENTES ASÍNCRONOS CON VALIDACIÓN ESTRICTA ---

async function ShippingStats() {
    try {
        const respuesta = await fetchShipping<{ datos: any[] }>('/api/shipments?estado=pendiente');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de Shipping App inválido");
        }

        return (
            <StatCard 
                titulo="Envíos Activos" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Pendientes de despacho"
                linkHref="/shipping"
                appName="Shipping App"
                colorApp="bg-blue-100 text-blue-800 border-blue-200"
            />
        );
    } catch (error) {
        return <ErrorCard titulo="Envíos Activos" appName="Shipping App" linkHref="/shipping" />;
    }
}

async function BuyerStats() {
    try {
        const respuesta = await fetchBuyer<{ datos: any[] }>('/api/users');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de Buyer App inválido");
        }

        return (
            <StatCard 
                titulo="Compradores" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Usuarios registrados"
                linkHref="/buyer"
                appName="Buyer App"
                colorApp="bg-emerald-100 text-emerald-800 border-emerald-200"
            />
        );
    } catch (error) {
        return <ErrorCard titulo="Compradores" appName="Buyer App" linkHref="/buyer" />;
    }
}

async function SellerStats() {
    try {
        const respuesta = await fetchSeller<{ datos: any[] }>('/api/products');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de Seller App inválido");
        }

        return (
            <StatCard 
                titulo="Productos" 
                valor={respuesta.datos.length.toString()} 
                subtexto="En el catálogo global"
                linkHref="/seller"
                appName="Seller App"
                colorApp="bg-purple-100 text-purple-800 border-purple-200"
            />
        );
    } catch (error) {
        return <ErrorCard titulo="Productos" appName="Seller App" linkHref="/seller" />;
    }
}

async function PaymentsStats() {
    try {
        const respuesta = await fetchPayments<{ datos: any[] }>('/api/payments');
        
        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error("Formato de Payments App inválido");
        }

        return (
            <StatCard 
                titulo="Transacciones" 
                valor={respuesta.datos.length.toString()} 
                subtexto="Operaciones monetarias"
                linkHref="/payments"
                appName="Payments App"
                colorApp="bg-orange-100 text-orange-800 border-orange-200"
            />
        );
    } catch (error) {
        return <ErrorCard titulo="Transacciones" appName="Payments App" linkHref="/payments" />;
    }
}

// --- COMPONENTES DE INTERFAZ DE USUARIO (UI) ---

function StatCard({ titulo, valor, subtexto, linkHref, appName, colorApp }: { titulo: string, valor: string, subtexto: string, linkHref: string, appName: string, colorApp: string }) {
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-dm text-sm font-bold text-foreground/70 uppercase tracking-wider">
                    {titulo}
                </h3>
                <span className={`font-dm text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorApp}`}>
                    {appName}
                </span>
            </div>
            <div className="font-syne text-4xl font-bold text-foreground mb-1">
                {valor}
            </div>
            <p className="font-dm text-xs text-foreground/60 mb-4">
                {subtexto}
            </p>
            <Link 
                href={linkHref}
                className="mt-auto font-dm text-sm text-primary font-bold hover:underline"
            >
                Ver detalle &rarr;
            </Link>
        </div>
    );
}

function ErrorCard({ titulo, appName, linkHref }: { titulo: string, appName: string, linkHref: string }) {
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-red-200 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 opacity-60">
                <h3 className="font-dm text-sm font-bold text-foreground/70 uppercase tracking-wider">
                    {titulo}
                </h3>
                <span className="font-dm text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    {appName}
                </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                <svg className="w-8 h-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-dm text-xs font-bold text-red-600">Servicio no disponible</span>
            </div>
            <Link 
                href={linkHref}
                className="mt-auto font-dm text-sm text-primary/50 font-bold hover:underline"
            >
                Ir a sección &rarr;
            </Link>
        </div>
    );
}

function CardSkeleton({ titulo }: { titulo: string }) {
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col animate-pulse">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-dm text-sm font-bold text-slate-300 uppercase tracking-wider">
                    {titulo}
                </h3>
                <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-10 w-20 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-slate-100 rounded mb-4"></div>
            <div className="mt-auto h-4 w-20 bg-slate-200 rounded"></div>
        </div>
    );
}