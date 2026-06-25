'use client';

import { useState } from 'react';
import { cargarVendedoresPagina } from './actions'; 

interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

export default function TablaVendedores({ 
    datosIniciales, 
    paginacion 
}: { 
    datosIniciales: any[], 
    paginacion?: Paginacion 
}) {
    const [vendedores, setVendedores] = useState(datosIniciales);
    const [estadoPaginacion, setEstadoPaginacion] = useState(paginacion);
    const [cargandoPagina, setCargandoPagina] = useState(false);

    const handleCambiarPagina = async (nuevaPagina: number) => {
        setCargandoPagina(true);
        try {
            const respuesta = await cargarVendedoresPagina(nuevaPagina);
            if (respuesta && respuesta.datos) {
                setVendedores(respuesta.datos);
                setEstadoPaginacion(respuesta.paginacion);
            }
        } catch (error) {
            alert('Error al cargar la página de vendedores');
        } finally {
            setCargandoPagina(false);
        }
    };

    if (!vendedores || vendedores.length === 0) {
        return <p className="font-dm text-sm text-foreground/60 p-4 text-center bg-muted/30 rounded-lg">No hay vendedores registrados.</p>;
    }

    const paginaActual = estadoPaginacion?.pagina || 1;
    const totalPaginas = estadoPaginacion?.totalPaginas || 1;

    return (
        <div className="space-y-6 font-dm relative">
            {cargandoPagina && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl" aria-live="polite">
                    <div className="bg-card border border-border px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-pulse text-foreground flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Actualizando lista...
                    </div>
                </div>
            )}

            {/* VISTA MÓVIL Y ESCRITORIO */}
            <div className="grid gap-4 md:block overflow-x-auto">
                <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/60 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold">Vendedor</th>
                            <th scope="col" className="p-4 font-semibold">Ubicación</th>
                            <th scope="col" className="p-4 font-semibold text-center">Productos Activos</th>
                            <th scope="col" className="p-4 font-semibold text-right">Ventas Totales</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {vendedores.map((vendedor) => (
                            <tr key={vendedor.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4 font-medium text-foreground">{vendedor.nombre}</td>
                                <td className="p-4 text-foreground/80">
                                    {vendedor.ciudad && vendedor.provincia 
                                        ? `${vendedor.ciudad}, ${vendedor.provincia}` 
                                        : 'No especificada'}
                                </td>
                                <td className="p-4 text-center text-foreground/80 font-mono text-xs">
                                    {vendedor.productos_activos}
                                </td>
                                <td className="p-4 font-bold text-foreground text-right">
                                    {vendedor.total_ventas} {/* Corregido propiedad backend */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tarjetas para vista móvil */}
                <div className="md:hidden space-y-4">
                     {vendedores.map((vendedor) => (
                        <div key={vendedor.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Vendedor</span>
                                    <p className="font-medium text-sm">{vendedor.nombre}</p>
                                    <p className="text-xs text-foreground/60 mt-0.5">
                                        {vendedor.ciudad && vendedor.provincia ? `${vendedor.ciudad}, ${vendedor.provincia}` : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Ventas</span>
                                    <p className="font-bold text-lg">{vendedor.total_ventas}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-border pt-3 text-xs text-foreground/70">
                                <span>Productos activos:</span>
                                <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded">
                                    {vendedor.productos_activos}
                                </span>
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <nav aria-label="Paginación de vendedores" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                    <p className="text-sm text-foreground/70 text-center sm:text-left">
                        Mostrando página <span className="font-bold text-foreground">{paginaActual}</span> de{' '}
                        <span className="font-bold text-foreground">{totalPaginas}</span>
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            disabled={paginaActual <= 1 || cargandoPagina}
                            onClick={() => handleCambiarPagina(paginaActual - 1)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted focus:ring-2 focus:ring-primary disabled:opacity-50 transition-colors font-semibold text-sm"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={paginaActual >= totalPaginas || cargandoPagina}
                            onClick={() => handleCambiarPagina(paginaActual + 1)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted focus:ring-2 focus:ring-primary disabled:opacity-50 transition-colors font-semibold text-sm"
                        >
                            Siguiente
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}