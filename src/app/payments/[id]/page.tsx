import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import Link from 'next/link'
import { FormularioReembolso } from './FormularioReembolso'

interface DetallePago {
    id: string
    ordenId: string
    estado: string
    monto: number
}

export default async function DetallePagoPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    let pago: DetallePago

    try {
        pago = await fetchPayments<DetallePago>(`/api/payments/${id}`)
    } catch (error) {
        const mensaje =
            error instanceof ErrorApi ? error.message : 'Error al conectar con Payments'
        return (
            <div className="p-8">
                <Link href="/payments" className="text-sm text-muted hover:underline">
                    ← Volver a pagos
                </Link>
                <h1 className="text-xl font-semibold mt-4 mb-4">Detalle de pago</h1>
                <p className="text-red-600">{mensaje}</p>
            </div>
        )
    }

    return (
        <div className="p-8">
            <Link href="/payments" className="text-sm text-muted hover:underline">
                ← Volver a pagos
            </Link>
            <h1 className="text-xl font-semibold mt-4 mb-6">Detalle de pago</h1>

            <div className="bg-card border border-border rounded-lg p-6 max-w-md space-y-3">
                <div>
                    <span className="text-muted text-sm">ID de pago</span>
                    <p>{pago.id}</p>
                </div>
                <div>
                    <span className="text-muted text-sm">Orden</span>
                    <p>{pago.ordenId}</p>
                </div>
                <div>
                    <span className="text-muted text-sm">Estado</span>
                    <p className="capitalize">{pago.estado}</p>
                </div>
                <div>
                    <span className="text-muted text-sm">Monto</span>
                    <p>${pago.monto.toLocaleString('es-AR')}</p>
                </div>
            </div>
            {pago.estado === 'aprobado' && (
                <FormularioReembolso id={pago.id} />
            )}
        </div>
    )
}