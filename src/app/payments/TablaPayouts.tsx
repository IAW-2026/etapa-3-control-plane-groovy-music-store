import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import Link from 'next/link'

// --- INTERFACES ---
interface Balance {
    seller_id: string
    balance_retenido: number
    balance_acreditado: number
}

interface Paginacion {
    pagina: number
    limite: number
    total: number
    totalPaginas: number
}

interface RespuestaPayouts {
    datos: Balance[]
    paginacion: Paginacion
}

interface TablaPayoutsProps {
    pagina: number
    limite: number
}

// --- HELPER ---
function formatoARS(valor: number): string {
    return Number(valor).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    })
}

// --- SERVER COMPONENT ---
export default async function TablaPayouts({ pagina, limite }: TablaPayoutsProps) {
    console.log(`ConsoleLog en TablaPayouts: Fetching /api/payouts?pagina=${pagina}&limite=${limite}`)

    let datos: Balance[] = []
    let paginacion: Paginacion = { pagina: 1, limite: 20, total: 0, totalPaginas: 0 }
    let error: string | null = null

    try {
        const res = await fetchPayments<RespuestaPayouts>(`/api/payouts?pagina=${pagina}&limite=${limite}`)
        datos = res.datos
        paginacion = res.paginacion
        console.log(`ConsoleLog en TablaPayouts: Recibidos ${datos.length} vendedores (página ${paginacion.pagina}/${paginacion.totalPaginas})`)
    } catch (err: unknown) {
        const mensaje = err instanceof ErrorApi ? err.message : 'Error inesperado al obtener balances'
        console.log(`ConsoleLog en TablaPayouts: Error al llamar /api/payouts — ${mensaje}`)
        error = mensaje
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div role="alert" className="p-5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-dm">
                <p className="font-bold mb-1">No se pudieron cargar los balances</p>
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    // --- EMPTY STATE ---
    if (datos.length === 0) {
        return (
            <div className="p-8 text-center text-foreground/80 font-dm border border-border rounded-xl bg-background shadow-sm">
                <svg className="mx-auto mb-3 w-10 h-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="font-medium text-foreground/70">No hay vendedores cargados</p>
                <p className="text-sm mt-1">Los balances aparecerán aquí cuando se registren liquidaciones.</p>
            </div>
        )
    }

    // --- TABLE ---
    return (
        <div className="space-y-4 font-dm">
            {/* VISTA ESCRITORIO */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/80 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold">Seller ID</th>
                            <th scope="col" className="p-4 font-semibold text-right">Balance Retenido</th>
                            <th scope="col" className="p-4 font-semibold text-right">Balance Acreditado</th>
                            <th scope="col" className="p-4 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {datos.map((b) => {
                            const total = b.balance_retenido + b.balance_acreditado
                            return (
                                <tr key={b.seller_id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-[#B83A15] font-medium break-all select-all">
                                        {b.seller_id}
                                    </td>
                                    <td className="p-4 text-right text-amber-700 font-medium">
                                        {formatoARS(b.balance_retenido)}
                                    </td>
                                    <td className="p-4 text-right text-emerald-700 font-medium">
                                        {formatoARS(b.balance_acreditado)}
                                    </td>
                                    <td className="p-4 text-right font-bold text-foreground">
                                        {formatoARS(total)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL */}
            <div className="md:hidden space-y-3">
                {datos.map((b) => {
                    const total = b.balance_retenido + b.balance_acreditado
                    return (
                        <div key={b.seller_id} className="bg-background border border-border p-4 rounded-xl shadow-sm space-y-3">
                            <div>
                                <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Seller ID</span>
                                <p className="font-mono text-xs text-[#B83A15] font-medium break-all select-all mt-0.5">{b.seller_id}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                                <div>
                                    <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Retenido</span>
                                    <p className="text-sm font-medium text-amber-700">{formatoARS(b.balance_retenido)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Acreditado</span>
                                    <p className="text-sm font-medium text-emerald-700">{formatoARS(b.balance_acreditado)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-foreground/80 uppercase font-bold tracking-wider">Total</span>
                                    <p className="text-sm font-bold text-foreground">{formatoARS(total)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex items-center justify-between border-t border-border pt-4 px-1">
                <span className="text-sm text-foreground/80">
                    Página <strong className="text-foreground">{paginacion.pagina}</strong> de{' '}
                    <strong className="text-foreground">{paginacion.totalPaginas}</strong>
                    <span className="hidden sm:inline"> — {paginacion.total} vendedores</span>
                </span>
                <div className="flex gap-2">
                    {paginacion.pagina > 1 ? (
                        <Link
                            href={`/payments?pagina=${paginacion.pagina - 1}&limite=${paginacion.limite}`}
                            className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors bg-background shadow-sm"
                        >
                            ← Anterior
                        </Link>
                    ) : (
                        <span className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg text-foreground/70 cursor-not-allowed bg-muted/20">
                            ← Anterior
                        </span>
                    )}
                    {paginacion.pagina < paginacion.totalPaginas ? (
                        <Link
                            href={`/payments?pagina=${paginacion.pagina + 1}&limite=${paginacion.limite}`}
                            className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors bg-background shadow-sm"
                        >
                            Siguiente →
                        </Link>
                    ) : (
                        <span className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg text-foreground/70 cursor-not-allowed bg-muted/20">
                            Siguiente →
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
