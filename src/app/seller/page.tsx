import { fetchSeller } from "@/lib/clientesApi";
import TablaProductos from "./TablaProductos";
import TablaVendedores from "./TablaVendedores";

export const revalidate = 1;


export const metadata = {
    title: 'Gestión de Vendedores y Catálogo - Control Plane',
    description: 'Panel de administración global para productos y vendedores de la Seller App.',
};

// --- INTERFACES ---
interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}


interface TipoProducto {
    id: string;
    titulo: string; 
    precio: number;
    stock: number;
    activo: boolean; 
    id_vendedor: string;
}

// Interfaz para el listado de vendedores 
interface TipoVendedor {
    id: string;
    nombre: string;
    mail: string;
    activo: boolean;
}

interface RespuestaAPI<T> {
    datos: T[];
    paginacion?: Paginacion; 
}

export default async function SellerPage() {
    let productosRes, vendedoresRes;
    let errorProductos = null;
    let errorVendedores = null;

    // Manejo de carga seguro en el servidor
    try {
        
        productosRes = await fetchSeller<RespuestaAPI<TipoProducto>>(`/api/admin/products?pagina=1&limite=5`);
    } catch (error: any) {
        errorProductos = error.message;
    }

    try {
        // Llama al listado de vendedores con stats
        vendedoresRes = await fetchSeller<RespuestaAPI<TipoVendedor>>(`/api/admin/sellers?page=1&limit=10`);
    } catch (error: any) {
        errorVendedores = error.message;
    }

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-primary-dark text-xl md:text-2xl font-medium mt-1">Seller App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Control del catálogo completo de productos y listado de vendedores con sus estadísticas.
                    </p>
                </div>
                
                <a 
                    href={`${process.env.SELLER_API_URL}/sign-in`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel de administración externo de la Seller App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-white bg-primary-dark hover:bg-primary px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN DE PRODUCTOS */}
                <section aria-labelledby="productos-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="productos-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" aria-hidden="true"></span>
                            Catálogo de Productos
                        </h2>
                    </div>
                    {errorProductos ? (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm" role="alert">
                            <strong>Error al cargar productos:</strong> {errorProductos}
                        </div>
                    ) : (
                        <TablaProductos datosIniciales={productosRes?.datos || []} paginacion={productosRes?.paginacion} />
                    )}
                </section>

                {/* SECCIÓN DE VENDEDORES */}
                <section aria-labelledby="vendedores-heading" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="vendedores-heading" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block" aria-hidden="true"></span>
                            Vendedores Registrados
                        </h2>
                    </div>
                    {errorVendedores ? (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-dm" role="alert">
                            <strong>Error al cargar vendedores:</strong> {errorVendedores}
                        </div>
                    ) : (
                        <TablaVendedores datosIniciales={vendedoresRes?.datos || []} paginacion={vendedoresRes?.paginacion} />
                    )}
                </section>
            </div>
        </main>
    );
}