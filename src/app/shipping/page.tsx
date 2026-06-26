import { fetchShipping, ErrorApi } from '@/lib/clientesApi';
import TablaEnvios from './TablaEnvios';
import TablaEmpresas from './TablaEmpresas';
import TablaOperadores from './TablaOperadores';
import { cargarOperadoresAction } from './actions';

export const revalidate = 1;

export const metadata = {
    title: 'Gestión de Envíos - Control Plane',
    description: 'Monitoreo operativo de logística, empresas de transporte y estados de entrega.',
};

interface Empresa {
    id: string;
    nombre: string;
    cuit?: string; 
    activa?: boolean;
}

interface Operador {
    id_clerk: string;
    mail: string;
    role: string;
    empresa: {
        id: string;
        nombre: string;
    };
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

interface Paginacion {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

interface RespuestaAPI<T> {
    datos: T[];
    paginacion?: Paginacion;
}

export default async function ShippingPage() {
    let listadoEnvios: RespuestaAPI<Envio> | null = null;
    let listadoEmpresas: RespuestaAPI<any> | null = null;
    let listadoOperadores: any = null;

    let errorEnvios: string | null = null;
    let errorEmpresas: string | null = null;
    let errorOperadores: string | null = null;

    const urlPanelExterno = `${process.env.SHIPPING_API_URL}/sign-in`;

    try {
        listadoEnvios = await fetchShipping<RespuestaAPI<Envio>>('/api/shipments?pagina=1&limite=5');
    } catch (error) {
        errorEnvios = error instanceof ErrorApi ? error.message : 'Error al conectar con el catálogo de envíos';
    }

    try {
        listadoEmpresas = await fetchShipping<RespuestaAPI<any>>('/api/empresas');
    } catch (error) {
        errorEmpresas = error instanceof ErrorApi ? error.message : 'Error al conectar con el servicio de empresas';
    }

    try {
        listadoOperadores = await cargarOperadoresAction();
    } catch (error: any) {
        errorOperadores = error.message || 'Error al conectar con el listado de operadores';
    }

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            {/* ENCABEZADO PRINCIPAL */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-primary-dark text-xl md:text-2xl font-bold mt-1">Shipping App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Monitoreo en tiempo real de despachos, códigos de seguimiento y cumplimiento de plazos logísticos.
                    </p>
                </div>
                
                <a 
                    href={urlPanelExterno} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel de administración externo de la Buyer App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-white bg-primary-dark hover:bg-primary px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            {/* CONTENIDO OPERATIVO */}
            <div className="space-y-10">
                
                {/* SECCIÓN 1: CONTROL DE ENVÍOS GLOBAL */}
                <section aria-labelledby="shipping-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="shipping-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" aria-hidden="true"></span>
                            Control de Distribución Global
                        </h2>
                    </div>

                    {errorEnvios ? (
                        <div className="p-4 bg-red-50 border-2 border-red-300 text-red-950 rounded-lg text-sm font-dm" role="alert">
                            <p><strong className="font-bold">Error operativo:</strong> {errorEnvios}</p>
                        </div>
                    ) : (
                        <TablaEnvios 
                            datosIniciales={listadoEnvios?.datos || []} 
                            paginacion={listadoEnvios?.paginacion} 
                        />
                    )}
                </section>

                {/* SECCIÓN 2: EMPRESAS LOGÍSTICAS */}
                <section aria-labelledby="empresas-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="empresas-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full inline-block" aria-hidden="true"></span>
                            Empresas de Transporte
                        </h2>
                    </div>

                    {errorEmpresas ? (
                        <div className="p-4 bg-red-50 border-2 border-red-300 text-red-950 rounded-lg text-sm font-dm" role="alert">
                            <p><strong className="font-bold">Error operativo:</strong> {errorEmpresas}</p>
                        </div>
                    ) : (
                        <TablaEmpresas 
                            datosIniciales={listadoEmpresas?.datos || []} 
                        />
                    )}
                </section>

                {/* SECCIÓN 3: OPERADORES */}
                <section aria-labelledby="operadores-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="operadores-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-teal-600 rounded-full inline-block" aria-hidden="true"></span>
                            Operadores Logísticos Autorizados
                        </h2>
                    </div>

                    {errorOperadores ? (
                        <div className="p-4 bg-red-50 border-2 border-red-300 text-red-950 rounded-lg text-sm font-dm" role="alert">
                            <p><strong className="font-bold">Error operativo:</strong> {errorOperadores}</p>
                        </div>
                    ) : (
                        <TablaOperadores 
                            datosIniciales={listadoOperadores?.datos || []} 
                        />
                    )}
                </section>

            </div>
        </main>
    );
}