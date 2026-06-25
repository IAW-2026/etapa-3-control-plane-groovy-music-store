import { fetchShipping, ErrorApi } from '@/lib/clientesApi';

export const metadata = {
    title: 'Gestión de Envíos - Control Plane',
    description: 'Monitoreo operativo de logística, empresas de transporte y estados de entrega.',
};

// --- INTERFACES  ---
interface Empresa {
    id: string;
    nombre: string;
}

interface Direccion {
    id: string;
    calle: string;
    ciudad: string;
    provincia: string;
    cod_postal: string;
    pais: string;
}

interface Envio {
    id: string;
    order_id: string;
    codigo_seguimiento: string;
    estado: string;
    seller_id: string;
    buyer_id: string;
    fecha_entrega_estimada: string;
    empresa: Empresa;
    direccionDestino: Direccion;
    direccionOrigen?: Direccion;
}

interface ListadoEnvios {
    datos: Envio[];
    paginacion: {
        pagina: number;
        limite: number;
        total: number;
        totalPaginas: number;
    };
}

//  mapeo de color 
function colorEstado(estado: string) {
    const normalize = estado.toUpperCase();
    switch (normalize) {
        case 'ENTREGADO':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'EN CAMINO':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'EN PREPARACIÓN':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
}

export default async function ShippingPage() {
    let listado: ListadoEnvios | null = null;
    let errorMensaje: string | null = null;

    // Consumo  seguro en el servidor
    try {
        listado = await fetchShipping<ListadoEnvios>('/api/shipments');
    } catch (error) {
        errorMensaje = error instanceof ErrorApi ? error.message : 'Error al conectar con el servicio de Shipping';
    }

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            {/* ENCABEZADO  */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-blue-600 text-xl md:text-2xl font-medium mt-1">Shipping App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Monitoreo en tiempo real de despachos, códigos de seguimiento y cumplimiento de plazos logísticos.
                    </p>
                </div>
                
                <a 
                    href="https://proyecto-c-shipping-groovy-music-store.vercel.app/admin" // Reemplazar con la url real si difiere
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel de logística externo de la Shipping App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            {/* CONTENIDO OPERATIVO */}
            <div className="space-y-10">
                <section aria-labelledby="shipping-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="shipping-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" aria-hidden="true"></span>
                            Control de Distribución Global
                        </h2>
                    </div>

                    {errorMensaje ? (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm" role="alert">
                            <strong>Error operativo:</strong> {errorMensaje}
                        </div>
                    ) : !listado || listado.datos.length === 0 ? (
                        <p className="font-dm text-sm text-foreground/60 p-4 text-center bg-muted/30 rounded-lg">
                            No se registran despachos ni envíos activos.
                        </p>
                    ) : (
                        <div className="space-y-4 font-dm">
                            {/* VISTA DE ESCRITORIO (Oculta en móviles) */}
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground/60 bg-muted/20">
                                            <th scope="col" className="p-4 font-semibold">Código Seguimiento</th>
                                            <th scope="col" className="p-4 font-semibold">Estado de Entrega</th>
                                            <th scope="col" className="p-4 font-semibold">Transportista</th>
                                            <th scope="col" className="p-4 font-semibold">Dirección Destino</th>
                                            <th scope="col" className="p-4 font-semibold text-right">Entrega Estimada</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-border">
                                        {listado.datos.map((envio) => (
                                            <tr key={envio.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="p-4 font-mono text-xs text-foreground/80">{envio.codigo_seguimiento}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorEstado(envio.estado)}`}>
                                                        {envio.estado}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-foreground font-medium">{envio.empresa.nombre}</td>
                                                <td className="p-4 text-foreground/70">
                                                    {envio.direccionDestino.ciudad}, {envio.direccionDestino.provincia}
                                                </td>
                                                <td className="p-4 text-right text-foreground font-medium">
                                                    {new Date(envio.fecha_entrega_estimada).toLocaleDateString('es-AR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* VISTA MÓVIL  */}
                            <div className="md:hidden space-y-4">
                                {listado.datos.map((envio) => (
                                    <div key={envio.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs text-foreground/50 uppercase font-bold tracking-wider">Seguimiento</span>
                                                <p className="font-mono text-sm font-medium text-foreground/80">{envio.codigo_seguimiento}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${colorEstado(envio.estado)}`}>
                                                {envio.estado}
                                            </span>
                                        </div>
                                        <div className="border-t border-border pt-3 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-foreground/60">Empresa:</span>
                                                <span className="font-bold text-foreground">{envio.empresa.nombre}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-foreground/60">Destino:</span>
                                                <span className="text-foreground/80 text-right">{envio.direccionDestino.ciudad}, {envio.direccionDestino.provincia}</span>
                                            </div>
                                            <div className="flex justify-between text-xs pt-1">
                                                <span className="text-foreground/60">Estimado:</span>
                                                <span className="font-semibold text-primary">{new Date(envio.fecha_entrega_estimada).toLocaleDateString('es-AR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}