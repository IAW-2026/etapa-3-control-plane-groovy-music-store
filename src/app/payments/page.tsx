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

export default async function PagosPage() {
    let listado: ListadoPagos

    try {
        listado = await fetchPayments<ListadoPagos>('/api/payments')
        console.log('Respuesta real de Payments:', JSON.stringify(listado, null, 2))  // ← temporal
    } catch (error) {
        console.error('Error real en /payments:', error) // ← temporal
        const mensaje =
            error instanceof ErrorApi ? error.message : 'Error al conectar con Payments'
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold mb-4">Pagos</h1>
                <p className="text-red-600">{mensaje}</p>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-xl font-semibold mb-4">Pagos</h1>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b border-border text-left">
                        <th className="py-2">Orden</th>
                        <th className="py-2">Estado</th>
                        <th className="py-2">Monto total</th>
                        <th className="py-2">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {listado.datos.map((t) => (
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
    )
}