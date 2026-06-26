'use client';

import { useState } from 'react';
import { cargarOrdenesPagina, actualizarEstadoOrden } from './actions';

const ESTADOS_VALIDOS = ["Procesando", "Pago Aprobado", "Pago Rechazado", "Cancelado", "En camino", "Entregado"];

interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

export default function TablaOrdenes({ 
    datosIniciales, 
    paginacion 
}: { 
    datosIniciales: any[], 
    paginacion?: Paginacion 
}) {
    const [ordenes, setOrdenes] = useState(datosIniciales);
    const [estadoPaginacion, setEstadoPaginacion] = useState(paginacion);
    const [cargandoId, setCargandoId] = useState<string | null>(null);
    const [cargandoPagina, setCargandoPagina] = useState(false);

    const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
        setCargandoId(id);
        try {
            await actualizarEstadoOrden(id, nuevoEstado);
            setOrdenes(prev => prev.map(o => o.nro_orden === id ? { ...o, estado: nuevoEstado } : o));
        } catch (error) {
            alert('No se pudo actualizar el estado de la orden');
        } finally {
            setCargandoId(null);
        }
    };

    const handleCambiarPagina = async (nuevaPagina: number) => {
        setCargandoPagina(true);
        try {
            const respuesta = await cargarOrdenesPagina(nuevaPagina);
            if (respuesta && respuesta.datos) {
                setOrdenes(respuesta.datos);
                setEstadoPaginacion(respuesta.paginacion);
            }
        } catch (error) {
            alert('Error al cargar la página de órdenes');
        } finally {
            setCargandoPagina(false);
        }
    };

    if (!ordenes || ordenes.length === 0) {
        return <p className="font-dm text-sm text-foreground/60 p-4 text-center bg-muted/30 rounded-lg">No hay órdenes registradas en este momento.</p>;
    }

    const paginaActual = estadoPaginacion?.pagina || 1;
    const totalPaginas = estadoPaginacion?.totalPaginas || 1;

    return (
        <div className="space-y-6 font-dm relative">
            {cargandoPagina && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl" aria-live="polite">
                    <div className="bg-card border border-border px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-pulse text-foreground flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Actualizando vista...
                    </div>
                </div>
            )}

            {/* VISTA MÓVIL (Tarjetas) Y ESCRITORIO (Tabla) */}
            <div className="grid gap-4 md:block overflow-x-auto">
                <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/80 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold">Nro Orden</th>
                            <th scope="col" className="p-4 font-semibold">Monto</th>
                            <th scope="col" className="p-4 font-semibold">Logística</th>
                            <th scope="col" className="p-4 font-semibold text-right">Gestión de Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {ordenes.map((orden) => (
                            <tr key={orden.nro_orden} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4 font-mono text-xs text-foreground/80">#{orden.nro_orden_usuario}</td>
                                <td className="p-4 font-bold text-foreground">${Number(orden.monto).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                                        {orden.empresa_envio}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <label htmlFor={`estado-${orden.nro_orden}`} className="sr-only">Cambiar estado de orden {orden.nro_orden_usuario}</label>
                                    <select
                                        id={`estado-${orden.nro_orden}`}
                                        disabled={cargandoId === orden.nro_orden || cargandoPagina}
                                        value={orden.estado}
                                        onChange={(e) => handleCambiarEstado(orden.nro_orden, e.target.value)}
                                        className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-shadow cursor-pointer w-full max-w-[160px] inline-block"
                                        title="Seleccionar nuevo estado"
                                    >
                                        {ESTADOS_VALIDOS.map(est => (
                                            <option key={est} value={est}>{est}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tarjetas para vista móvil (se ocultan en lg) */}
                <div className="md:hidden space-y-4">
                     {ordenes.map((orden) => (
                        <div key={orden.nro_orden} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Orden</span>
                                    <p className="font-mono text-sm font-medium">#{orden.nro_orden_usuario}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Monto</span>
                                    <p className="font-bold text-lg">${Number(orden.monto).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-border pt-3">
                                 <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                                    {orden.empresa_envio}
                                </span>
                                <select
                                    disabled={cargandoId === orden.nro_orden || cargandoPagina}
                                    value={orden.estado}
                                    onChange={(e) => handleCambiarEstado(orden.nro_orden, e.target.value)}
                                    className="bg-background border border-input rounded-lg px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-primary"
                                    aria-label={`Estado orden ${orden.nro_orden_usuario}`}
                                >
                                    {ESTADOS_VALIDOS.map(est => (
                                        <option key={est} value={est}>{est}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <nav aria-label="Paginación de órdenes" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
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
                            aria-label="Ir a página anterior"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={paginaActual >= totalPaginas || cargandoPagina}
                            onClick={() => handleCambiarPagina(paginaActual + 1)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted focus:ring-2 focus:ring-primary disabled:opacity-50 transition-colors font-semibold text-sm"
                            aria-label="Ir a página siguiente"
                        >
                            Siguiente
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}