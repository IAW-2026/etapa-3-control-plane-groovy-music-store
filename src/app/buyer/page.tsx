import { fetchBuyer } from "@/lib/clientesApi";
import TablaOrdenes from "./TablaOrdenes";
import TablaUsuarios from "./TablaUsuarios";

export const metadata = {
    title: 'Gestión de Compradores - Control Plane',
    description: 'Panel de administración global para usuarios y órdenes de la Buyer App.',
};

// --- INTERFACES ---
interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

interface TipoOrden {
    nro_orden: string;
    nro_orden_usuario: number;
    monto: number;
    estado: string;
    fecha: string;
    empresa_envio: string;
    id_buyer: string;
}

interface TipoUsuario {
    clerk_id: string;
    nombre: string;
    mail: string;
    activo: boolean;
}

interface RespuestaAPI<T> {
    datos: T[];
    paginacion?: Paginacion; 
}

export default async function BuyerPage() {
    let ordenesRes, usuariosRes;
    let errorOrdenes = null;
    let errorUsuarios = null;

    // Manejo de carga seguro en el servidor
    try {
        ordenesRes = await fetchBuyer<RespuestaAPI<TipoOrden>>(`/api/orders?page=1&limit=10`);
    } catch (error: any) {
        errorOrdenes = error.message;
    }

    try {
        usuariosRes = await fetchBuyer<RespuestaAPI<TipoUsuario>>(`/api/users?page=1&limit=10`);
    } catch (error: any) {
        errorUsuarios = error.message;
    }

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-primary text-xl md:text-2xl font-medium mt-1">Buyer App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Control operativo de órdenes de compra y estado de cuentas de usuarios del ecosistema.
                    </p>
                </div>
                
                <a 
                    href={`${process.env.BUYER_API_URL}/sign-in`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel de administración externo de la Buyer App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN DE ÓRDENES */}
                <section aria-labelledby="ordenes-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="ordenes-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" aria-hidden="true"></span>
                            Listado de Órdenes
                        </h2>
                    </div>
                    {errorOrdenes ? (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm" role="alert">
                            <strong>Error al cargar órdenes:</strong> {errorOrdenes}
                        </div>
                    ) : (
                        <TablaOrdenes datosIniciales={ordenesRes?.datos || []} paginacion={ordenesRes?.paginacion} />
                    )}
                </section>

                {/* SECCIÓN DE USUARIOS */}
                <section aria-labelledby="usuarios-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="usuarios-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block" aria-hidden="true"></span>
                            Compradores Registrados
                        </h2>
                    </div>
                    {errorUsuarios ? (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm" role="alert">
                            <strong>Error al cargar usuarios:</strong> {errorUsuarios}
                        </div>
                    ) : (
                        <TablaUsuarios datosIniciales={usuariosRes?.datos || []} paginacion={usuariosRes?.paginacion} />
                    )}
                </section>
            </div>
        </main>
    );
}