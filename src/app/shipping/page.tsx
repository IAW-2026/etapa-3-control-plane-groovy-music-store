import { fetchShipping, ErrorApi } from '@/lib/clientesApi'

interface Empresa {
    id: string
    nombre: string
}

interface Direccion {
    id: string
    calle: string
    ciudad: string
    provincia: string
    cod_postal: string
    pais: string
}

interface Envio {
    id: string
    order_id: string
    codigo_seguimiento: string
    estado: string
    seller_id: string
    buyer_id: string
    fecha_entrega_estimada: string
    empresa: Empresa
    direccionDestino: Direccion
    direccionOrigen?: Direccion   // 👈 opcional, no todos los registros lo traen
}

interface ListadoEnvios {
    datos: Envio[]
    paginacion: {
        pagina: number
        limite: number
        total: number
        totalPaginas: number
    }
}

function colorEstado(estado: string) {
    switch (estado) {
        case 'ENTREGADO':
            return 'bg-emerald-100 text-emerald-700'
        case 'EN CAMINO':
            return 'bg-blue-100 text-blue-700'
        case 'EN PREPARACIÓN':
            return 'bg-amber-100 text-amber-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

export default async function ShippingPage() {
    let listado: ListadoEnvios

    try {
        listado = await fetchShipping<ListadoEnvios>('/api/shipments')
    } catch (error) {
        const mensaje =
            error instanceof ErrorApi ? error.message : 'Error al conectar con Shipping'
        return (
            <div className="max-w-7xl mx-auto">
                <h1 className="font-syne text-3xl font-semibold text-foreground mb-6">Envíos</h1>
                <p className="text-red-600">{mensaje}</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="font-syne text-3xl font-semibold text-foreground mb-6">Envíos</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-border text-left">
                            <th className="py-2">Seguimiento</th>
                            <th className="py-2">Estado</th>
                            <th className="py-2">Empresa</th>
                            <th className="py-2">Destino</th>
                            <th className="py-2">Entrega estimada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listado.datos.map((envio) => (
                            <tr key={envio.id} className="border-b border-border">
                                <td className="py-2">{envio.codigo_seguimiento}</td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${colorEstado(envio.estado)}`}>
                                        {envio.estado}
                                    </span>
                                </td>
                                <td className="py-2">{envio.empresa.nombre}</td>
                                <td className="py-2">
                                    {envio.direccionDestino.ciudad}, {envio.direccionDestino.provincia}
                                </td>
                                <td className="py-2">
                                    {new Date(envio.fecha_entrega_estimada).toLocaleDateString('es-AR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}