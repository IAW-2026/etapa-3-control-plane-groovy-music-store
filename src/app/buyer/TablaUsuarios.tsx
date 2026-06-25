'use client';

import { useState } from 'react';
import { cargarUsuariosPagina, actualizarEstadoUsuario } from './actions';

interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

export default function TablaUsuarios({ 
    datosIniciales, 
    paginacion 
}: { 
    datosIniciales: any[], 
    paginacion?: Paginacion 
}) {
    const [usuarios, setUsuarios] = useState(datosIniciales);
    const [estadoPaginacion, setEstadoPaginacion] = useState(paginacion);
    const [cargandoId, setCargandoId] = useState<string | null>(null);
    const [cargandoPagina, setCargandoPagina] = useState(false);

    const handleToggleActivo = async (clerkId: string, estadoActual: boolean) => {
        setCargandoId(clerkId);
        const nuevoEstado = !estadoActual;
        try {
            await actualizarEstadoUsuario(clerkId, nuevoEstado);
            setUsuarios(prev => prev.map(u => u.clerk_id === clerkId ? { ...u, activo: nuevoEstado } : u));
        } catch (error) {
            alert('Error al modificar el estado del usuario');
        } finally {
            setCargandoId(null);
        }
    };

    const handleCambiarPagina = async (nuevaPagina: number) => {
        setCargandoPagina(true);
        try {
            const respuesta = await cargarUsuariosPagina(nuevaPagina);
            if (respuesta && respuesta.datos) {
                setUsuarios(respuesta.datos);
                setEstadoPaginacion(respuesta.paginacion);
            }
        } catch (error) {
            alert('Error al cargar la página de usuarios');
        } finally {
            setCargandoPagina(false);
        }
    };

    if (!usuarios || usuarios.length === 0) {
         return <p className="font-dm text-sm text-foreground/60 p-4 text-center bg-muted/30 rounded-lg">No hay compradores registrados en este momento.</p>;
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

            {/* VISTA MÓVIL (Tarjetas) Y ESCRITORIO (Tabla) */}
            <div className="grid gap-4 md:block overflow-x-auto">
                <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/60 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold">Comprador</th>
                            <th scope="col" className="p-4 font-semibold">Contacto</th>
                            <th scope="col" className="p-4 font-semibold">Estado de Cuenta</th>
                            <th scope="col" className="p-4 font-semibold text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {usuarios.map((usuario) => (
                            <tr key={usuario.clerk_id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-bold text-foreground">{usuario.nombre}</td>
                                <td className="p-4 text-foreground/70">{usuario.mail}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                        usuario.activo 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${usuario.activo ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        {usuario.activo ? 'Activo' : 'Suspendido'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        type="button"
                                        disabled={cargandoId === usuario.clerk_id || cargandoPagina}
                                        onClick={() => handleToggleActivo(usuario.clerk_id, usuario.activo)}
                                        aria-label={`${usuario.activo ? 'Suspender' : 'Activar'} cuenta de ${usuario.nombre}`}
                                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 focus:ring-2 focus:ring-offset-1 focus:outline-none w-28 ${
                                            usuario.activo 
                                                ? 'bg-background text-red-600 hover:bg-red-50 border border-red-200 focus:ring-red-500' 
                                                : 'bg-background text-emerald-600 hover:bg-emerald-50 border border-emerald-200 focus:ring-emerald-500'
                                        }`}
                                    >
                                        {cargandoId === usuario.clerk_id ? (
                                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                        ) : usuario.activo ? 'Suspender' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tarjetas para vista móvil */}
                <div className="md:hidden space-y-4">
                     {usuarios.map((usuario) => (
                        <div key={usuario.clerk_id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                            <div>
                                <h3 className="font-bold text-foreground text-base">{usuario.nombre}</h3>
                                <p className="text-sm text-foreground/70">{usuario.mail}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                                    usuario.activo 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {usuario.activo ? 'Activo' : 'Suspendido'}
                                </span>
                                <button
                                    type="button"
                                    disabled={cargandoId === usuario.clerk_id || cargandoPagina}
                                    onClick={() => handleToggleActivo(usuario.clerk_id, usuario.activo)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                                        usuario.activo 
                                            ? 'bg-background text-red-600 border border-red-200' 
                                            : 'bg-background text-emerald-600 border border-emerald-200'
                                    }`}
                                >
                                    {cargandoId === usuario.clerk_id ? 'Procesando...' : usuario.activo ? 'Suspender' : 'Activar'}
                                </button>
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <nav aria-label="Paginación de usuarios" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
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
                            aria-label="Ir a página anterior de usuarios"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={paginaActual >= totalPaginas || cargandoPagina}
                            onClick={() => handleCambiarPagina(paginaActual + 1)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted focus:ring-2 focus:ring-primary disabled:opacity-50 transition-colors font-semibold text-sm"
                            aria-label="Ir a página siguiente de usuarios"
                        >
                            Siguiente
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}