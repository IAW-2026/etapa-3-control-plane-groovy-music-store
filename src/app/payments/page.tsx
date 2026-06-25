import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import Link from 'next/link'

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

export default async function PaymentsPage() {
    const [listado, reclamos] = await Promise.all([obtenerListado(), obtenerReclamos()])

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="font-syne text-3xl font-semibold text-foreground mb-6">Pagos</h1>

            <section aria-labelledby="disputas-titulo" className="mb-8">
                <h2 id="disputas-titulo" className="font-syne text-xl font-semibold text-foreground mb-3">
                    Disputas
                </h2>
                {reclamos.ok ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted">Total reclamos</p>
                            <p className="text-2xl font-semibold text-foreground">{reclamos.data.totalReclamos}</p>
                        </div>
                        <div
                            className={`rounded-lg p-4 border ${reclamos.data.sinResolver > 0
                                    ? 'bg-amber-100 border-amber-300'
                                    : 'bg-card border-border'
                                }`}
                        >
                            <p className={`text-xs ${reclamos.data.sinResolver > 0 ? 'text-amber-700' : 'text-muted'}`}>
                                Sin resolver
                            </p>
                            <p
                                className={`text-2xl font-semibold ${reclamos.data.sinResolver > 0 ? 'text-amber-700' : 'text-foreground'
                                    }`}
                            >
                                {reclamos.data.sinResolver}
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted">Resueltos</p>
                            <p className="text-2xl font-semibold text-foreground">{reclamos.data.resueltos}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted">Tiempo prom. resolución</p>
                            <p className="text-2xl font-semibold text-foreground">
                                {reclamos.data.tiempoPromedioResolucionHoras}h
                            </p>
                        </div>
                    </div>
                ) : (
                    <div role="alert" className="bg-card border border-border rounded-lg p-4 text-sm">
                        <p className="font-medium text-foreground">Servicio no disponible</p>
                        <p className="text-foreground/70">{reclamos.mensaje}</p>
                    </div>
                )}
            </section>

            <section aria-labelledby="transacciones-titulo">
                <h2 id="transacciones-titulo" className="font-syne text-xl font-semibold text-foreground mb-3">
                    Transacciones
                </h2>
                {listado.ok ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th scope="col" className="py-2">Orden</th>
                                    <th scope="col" className="py-2">Estado</th>
                                    <th scope="col" className="py-2">Monto</th>
                                    <th scope="col" className="py-2">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listado.data.datos.map((t) => (
                                    <tr key={t.id} className="border-b border-border">
                                        <td className="py-2">
                                            <Link href={`/payments/${t.id}`} className="text-primary hover:underline">
                                                {t.ordenId}
                                            </Link>
                                        </td>
                                        <td className="py-2">{t.estado}</td>
                                        <td className="py-2">${t.monto.toLocaleString('es-AR')}</td>
                                        <td className="py-2">{new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div role="alert" className="bg-card border border-border rounded-lg p-4 text-sm">
                        <p className="font-medium text-foreground">Servicio no disponible</p>
                        <p className="text-foreground/70">{listado.mensaje}</p>
                    </div>
                )}
            </section>
        </div>
    )
}