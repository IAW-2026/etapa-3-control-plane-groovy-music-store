import { Suspense } from 'react'
import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import Link from 'next/link'
import TablaPayouts from './TablaPayouts'
import TablaPayoutsSkeleton from './TablaPayoutsSkeleton'

export const metadata = {
    title: 'Gestión de Pagos - Control Plane',
    description: 'Monitorización de transacciones financieras, liquidaciones y resolución de disputas.',
};

// --- INTERFACES ---
interface Transaccion {
    id: string
    ordenId: string
    buyerId: string
    sellerId: string
    monto: number
    estado: string
    fecha: string
}

interface ListadoPagos {
    datos: Transaccion[]
    paginacion: {
        pagina: number
        limite: number
        total: number
        totalPaginas: number
    }
}

interface ResumenReclamos {
    totalReclamos: number
    sinResolver: number
    resueltos: number
    tiempoPromedioResolucionHoras: number
}

// --- LÓGICA DE DATOS ---
async function obtenerListado() {
    try {
        return { ok: true as const, data: await fetchPayments<ListadoPagos>('/api/payments') }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Servicio no disponible'
        return { ok: false as const, mensaje }
    }
}

async function obtenerReclamos() {
    try {
        return { ok: true as const, data: await fetchPayments<ResumenReclamos>('/api/analytics/reclamos') }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Servicio no disponible'
        return { ok: false as const, mensaje }
    }
}

//  colores de estado de pago
function colorEstadoPago(estado: string) {
    const normalize = estado.toLowerCase();
    if (normalize.includes('aprobado') || normalize.includes('completado')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (normalize.includes('rechazado') || normalize.includes('fallido')) return 'bg-red-50 text-red-700 border-red-200';
    if (normalize.includes('pendiente') || normalize.includes('proceso')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PaymentsPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams
    const paginaPayouts = Number(searchParams?.pagina) || 1
    const limitePayouts = Number(searchParams?.limite) || 20

    const [listado, reclamos] = await Promise.all([obtenerListado(), obtenerReclamos()])

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            {/* ENCABEZADO  */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-orange-600 text-xl md:text-2xl font-medium mt-1">Payments App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Monitorización de transacciones financieras, liquidaciones y resolución de disputas.
                    </p>
                </div>

                <a
                    href="https://proyecto-c-payments-groovy-music-store.vercel.app/sign-in" // URL ilustrativa
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel financiero externo de la Payments App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN DE DISPUTAS Y RECLAMOS (Métricas) */}
                <section aria-labelledby="disputas-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="disputas-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-amber-500 rounded-full inline-block" aria-hidden="true"></span>
                            Métricas de Disputas
                        </h2>
                    </div>

                    {reclamos.ok ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-dm">
                            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-wider font-bold text-foreground/60 mb-1">Total Reclamos</p>
                                <p className="text-3xl font-syne font-bold text-foreground">{reclamos.data.totalReclamos}</p>
                            </div>

                            <div className={`rounded-xl p-5 shadow-sm border transition-colors ${reclamos.data.sinResolver > 0
                                ? 'bg-red-50/50 border-red-200'
                                : 'bg-background border-border'
                                }`}>
                                <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${reclamos.data.sinResolver > 0 ? 'text-red-600' : 'text-foreground/60'
                                    }`}>
                                    Sin Resolver
                                </p>
                                <p className={`text-3xl font-syne font-bold ${reclamos.data.sinResolver > 0 ? 'text-red-700' : 'text-foreground'
                                    }`}>
                                    {reclamos.data.sinResolver}
                                </p>
                            </div>

                            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-wider font-bold text-foreground/60 mb-1">Resueltos</p>
                                <p className="text-3xl font-syne font-bold text-emerald-600">{reclamos.data.resueltos}</p>
                            </div>

                            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-wider font-bold text-foreground/60 mb-1">Tiempo Promedio Resolucion</p>
                                <p className="text-3xl font-syne font-bold text-foreground flex items-baseline gap-1">
                                    {reclamos.data.tiempoPromedioResolucionHoras} <span className="text-base font-dm text-foreground/60">hs</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm">
                            <strong>Error de métricas:</strong> {reclamos.mensaje}
                        </div>
                    )}
                </section>

                {/* SECCIÓN DE TRANSACCIONES (Tabla/Tarjetas) */}
                <section aria-labelledby="transacciones-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="transacciones-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block" aria-hidden="true"></span>
                            Historial de Transacciones
                        </h2>
                    </div>

                    {listado.ok ? (
                        <div className="space-y-4 font-dm">
                            {/* VISTA ESCRITORIO */}
                            <div className="overflow-x-auto hidden md:block">
                                {/* Se agregó table-fixed para controlar anchos */}
                                <table className="w-full text-left border-collapse table-fixed md:table">
                                    <thead>
                                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/60 bg-muted/20">
                                            {/* Se ensanchó explícitamente esta columna */}
                                            <th scope="col" className="p-4 font-semibold w-64 md:w-1/3">Nro Orden</th>
                                            <th scope="col" className="p-4 font-semibold">Estado de Pago</th>
                                            <th scope="col" className="p-4 font-semibold">Monto Procesado</th>
                                            <th scope="col" className="p-4 font-semibold text-right">Fecha de Ingreso</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-border">
                                        {listado.data.datos.slice(0, 10).map((t) => (
                                            <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                                                {/* Se agregaron utilidades break-all y select-all, mostrando el ID completo */}
                                                <td className="p-4 font-mono text-xs break-all select-all">
                                                    <Link href={`/payments/${t.id}`} className="text-primary font-bold hover:underline" aria-label={`Ver detalle de transacción ${t.ordenId}`}>
                                                        {t.ordenId}
                                                    </Link>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorEstadoPago(t.estado)}`}>
                                                        {t.estado}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-foreground">
                                                    ${Number(t.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-4 text-right text-foreground/80">
                                                    {new Date(t.fecha).toLocaleDateString('es-AR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* VISTA MÓVIL */}
                            <div className="md:hidden space-y-4">
                                {listado.data.datos.slice(0, 10).map((t) => (
                                    <div key={t.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="max-w-[60%]">
                                                <span className="text-xs text-foreground/50 uppercase font-bold tracking-wider">Orden Vinculada</span>
                                                <p className="font-mono text-sm font-medium text-primary break-all hover:underline">
                                                    <Link href={`/payments/${t.id}`}>
                                                        {t.ordenId.substring(0, 12)}...
                                                    </Link>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-foreground/50 uppercase font-bold tracking-wider">Monto</span>
                                                <p className="font-bold text-lg">${Number(t.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-border pt-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${colorEstadoPago(t.estado)}`}>
                                                {t.estado}
                                            </span>
                                            <span className="text-xs font-medium text-foreground/70">
                                                {new Date(t.fecha).toLocaleDateString('es-AR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm">
                            <strong>Error de transacciones:</strong> {listado.mensaje}
                        </div>
                    )}
                </section>

                {/* SECCIÓN DE BALANCES DE VENDEDORES (Payouts) */}
                <section aria-labelledby="balances-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="balances-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" aria-hidden="true"></span>
                            Balances de Vendedores
                        </h2>
                    </div>

                    <Suspense fallback={<TablaPayoutsSkeleton />}>
                        <TablaPayouts pagina={paginaPayouts} limite={limitePayouts} />
                    </Suspense>
                </section>
            </div>
        </main>
    );
}