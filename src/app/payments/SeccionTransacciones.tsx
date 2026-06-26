import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import Link from 'next/link'

interface Transaccion {
    id: string
    ordenId: string
    buyerId: string
    sellerId: string
    monto: number
    estado: string
    creadoEn: string
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

function colorEstadoPago(estado: string) {
    const normalize = estado.toLowerCase();
    if (normalize.includes('aprobado') || normalize.includes('completado')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (normalize.includes('rechazado') || normalize.includes('fallido')) return 'bg-red-50 text-red-700 border-red-200';
    if (normalize.includes('pendiente') || normalize.includes('proceso')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
}

export default async function SeccionTransacciones() {
    let listado: { ok: true; data: ListadoPagos } | { ok: false; mensaje: string }

    try {
        const data = await fetchPayments<ListadoPagos>('/api/payments')
        listado = { ok: true, data }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Servicio no disponible'
        listado = { ok: false, mensaje }
    }

    if (!listado.ok) {
        return (
            <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm">
                <strong>Error de transacciones:</strong> {listado.mensaje}
            </div>
        )
    }

    return (
        <div className="space-y-4 font-dm">
            {/* VISTA ESCRITORIO */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse table-fixed md:table">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/80 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold w-64 md:w-1/3">Nro Orden</th>
                            <th scope="col" className="p-4 font-semibold">Estado de Pago</th>
                            <th scope="col" className="p-4 font-semibold">Monto Procesado</th>
                            <th scope="col" className="p-4 font-semibold text-right">Fecha de Ingreso</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {listado.data.datos.slice(0, 10).map((t) => (
                            <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4 font-mono text-xs break-all select-all">
                                    <Link href={`/payments/${t.id}`} className="text-[#B83A15] font-bold hover:underline" aria-label={`Ver detalle de transacción ${t.ordenId}`}>
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
                                    {new Date(t.creadoEn).toLocaleDateString('es-AR')}
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
                                <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Orden Vinculada</span>
                                <p className="font-mono text-sm font-medium text-[#B83A15] break-all hover:underline">
                                    <Link href={`/payments/${t.id}`}>
                                        {t.ordenId.substring(0, 12)}...
                                    </Link>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Monto</span>
                                <p className="font-bold text-lg">${Number(t.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-border pt-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${colorEstadoPago(t.estado)}`}>
                                {t.estado}
                            </span>
                            <span className="text-xs font-medium text-foreground/70">
                                {new Date(t.creadoEn).toLocaleDateString('es-AR')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
