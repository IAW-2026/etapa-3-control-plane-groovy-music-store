import { fetchPayments, ErrorApi } from '@/lib/clientesApi'

interface ResumenReclamos {
    totalReclamos: number
    sinResolver: number
    resueltos: number
    tiempoPromedioResolucionHoras: number
}

export default async function SeccionDisputas() {
    let reclamos: { ok: true; data: ResumenReclamos } | { ok: false; mensaje: string }

    try {
        const data = await fetchPayments<ResumenReclamos>('/api/analytics/reclamos')
        reclamos = { ok: true, data }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Servicio no disponible'
        reclamos = { ok: false, mensaje }
    }

    if (!reclamos.ok) {
        return (
            <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm">
                <strong>Error de métricas:</strong> {reclamos.mensaje}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-dm">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/80 mb-1">Total Reclamos</p>
                <p className="text-3xl font-syne font-bold text-foreground">{reclamos.data.totalReclamos}</p>
            </div>

            <div className={`rounded-xl p-5 shadow-sm border transition-colors ${reclamos.data.sinResolver > 0
                ? 'bg-red-50/50 border-red-200'
                : 'bg-background border-border'
                }`}>
                <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${reclamos.data.sinResolver > 0 ? 'text-red-700' : 'text-foreground/80'
                    }`}>
                    Sin Resolver
                </p>
                <p className={`text-3xl font-syne font-bold ${reclamos.data.sinResolver > 0 ? 'text-red-700' : 'text-foreground'
                    }`}>
                    {reclamos.data.sinResolver}
                </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/80 mb-1">Resueltos</p>
                <p className="text-3xl font-syne font-bold text-emerald-600">{reclamos.data.resueltos}</p>
            </div>

            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/80 mb-1">Tiempo Promedio Resolucion</p>
                <p className="text-3xl font-syne font-bold text-foreground flex items-baseline gap-1">
                    {reclamos.data.tiempoPromedioResolucionHoras} <span className="text-base font-dm text-foreground/80">hs</span>
                </p>
            </div>
        </div>
    )
}
