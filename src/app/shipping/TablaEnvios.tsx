'use client';

import { useState } from 'react';
import { modificarEnvioAction, cancelarEnvioAction, cargarEnviosPagina } from './actions';

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

interface Paginacion {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

const ESTADOS_LOGISTICOS = ["EN PREPARACIÓN", "EN CAMINO", "ENTREGADO"];

function colorEstado(estado: string) {
    const normalize = estado.toUpperCase();
    switch (normalize) {
        case 'ENTREGADO':
            return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
        case 'EN CAMINO':
            return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300';
        case 'EN PREPARACIÓN':
            return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
        default:
            return 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-900 dark:text-slate-300';
    }
}

export default function TablaEnvios({ datosIniciales, paginacion }: { datosIniciales: Envio[]; paginacion?: Paginacion }) {
    const [envios, setEnvios] = useState<Envio[]>(datosIniciales);
    const [estadoPaginacion, setEstadoPaginacion] = useState(paginacion);
    const [cargandoPagina, setCargandoPagina] = useState(false);
    
    const [idFilaEditando, setIdFilaEditando] = useState<string | null>(null);
    const [valoresEditando, setValoresEditando] = useState<{ estado: string; fecha_entrega_estimada: string } | null>(null);
    const [cargandoId, setCargandoId] = useState<string | null>(null);

    const iniciarEdicion = (envio: Envio) => {
        setIdFilaEditando(envio.id);
        const fechaFormateada = new Date(envio.fecha_entrega_estimada).toISOString().split('T')[0];
        setValoresEditando({
            estado: envio.estado,
            fecha_entrega_estimada: fechaFormateada
        });
    };

    const handleGuardarCambios = async (id: string) => {
        if (!valoresEditando) return;
        setCargandoId(id);
        try {
            const resultado = await modificarEnvioAction(id, valoresEditando);
            if (resultado.success) {
                setEnvios(prev => prev.map(e => e.id === id ? { 
                    ...e, 
                    estado: valoresEditando.estado,
                    fecha_entrega_estimada: new Date(valoresEditando.fecha_entrega_estimada).toISOString()
                } : e));
                setIdFilaEditando(null);
                setValoresEditando(null);
            } else {
                alert(resultado.error || 'Error al guardar modificaciones');
            }
        } catch (error) {
            alert('No se pudieron procesar los cambios operativos');
        } finally {
            setCargandoId(null);
        }
    };

    const handleCancelarEnvio = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas cancelar este envío de forma permanente?')) {
            setCargandoId(id);
            try {
                const resultado = await cancelarEnvioAction(id);
                if (resultado.success) {
                    setEnvios(prev => prev.filter(e => e.id !== id));
                } else {
                    alert(resultado.error || 'No se pudo cancelar el envío.');
                }
            } catch (error) {
                alert('Error al conectar con el servidor.');
            } finally {
                setCargandoId(null);
            }
        }
    };

    const handleCambiarPagina = async (nuevaPagina: number) => {
        setCargandoPagina(true);
        try {
            const respuesta = await cargarEnviosPagina(nuevaPagina);
            if (respuesta && respuesta.datos) {
                setEnvios(respuesta.datos);
                setEstadoPaginacion(respuesta.paginacion);
            }
        } catch (error) {
            alert('Error al cargar la página de envíos');
        } finally {
            setCargandoPagina(false);
        }
    };

    if (envios.length === 0) {
        return (
            <p className="font-dm text-base text-foreground p-4 text-center bg-muted/30 rounded-lg">
                No se registran despachos ni envíos activos.
            </p>
        );
    }

    return (
        <div className="space-y-6 font-dm relative">
            {cargandoPagina && (
                <div role="status" aria-live="polite" className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                    <div className="bg-card border border-border px-6 py-3 rounded-xl shadow-lg text-sm font-bold text-foreground flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Actualizando despachos...
                    </div>
                </div>
            )}

            {/* VISTA DESKTOP */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground bg-muted/20">
                            <th scope="col" className="p-4 font-bold">Código Seguimiento</th>
                            <th scope="col" className="p-4 font-bold">Estado de Entrega</th>
                            <th scope="col" className="p-4 font-bold">Transportista</th>
                            <th scope="col" className="p-4 font-bold">Dirección Destino</th>
                            <th scope="col" className="p-4 font-bold">Entrega Estimada</th>
                            <th scope="col" className="p-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {envios.map((envio) => {
                            const estaEditando = idFilaEditando === envio.id;
                            return (
                                <tr key={envio.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-4 font-mono text-sm text-foreground">#{envio.codigo_seguimiento}</td>
                                    <td className="p-4">
                                        {estaEditando ? (
                                            <>
                                                <label htmlFor={`estado-${envio.id}`} className="sr-only">Estado del envío {envio.codigo_seguimiento}</label>
                                                <select
                                                    id={`estado-${envio.id}`}
                                                    className="bg-background border border-input rounded px-2 py-1 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    value={valoresEditando?.estado}
                                                    onChange={e => setValoresEditando(prev => prev ? { ...prev, estado: e.target.value } : null)}
                                                >
                                                    {ESTADOS_LOGISTICOS.map(st => (
                                                        <option key={st} value={st}>{st}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorEstado(envio.estado)}`}>
                                                {envio.estado}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-foreground font-bold">{envio.empresa?.nombre || 'No asignado'}</td>
                                    <td className="p-4 text-foreground">{envio.direccionDestino.ciudad}, {envio.direccionDestino.provincia}</td>
                                    <td className="p-4 text-foreground font-bold">
                                        {estaEditando ? (
                                            <>
                                                <label htmlFor={`fecha-${envio.id}`} className="sr-only">Fecha estimada de entrega para {envio.codigo_seguimiento}</label>
                                                <input 
                                                    id={`fecha-${envio.id}`}
                                                    type="date"
                                                    className="bg-background border border-input rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    value={valoresEditando?.fecha_entrega_estimada}
                                                    onChange={e => setValoresEditando(prev => prev ? { ...prev, fecha_entrega_estimada: e.target.value } : null)}
                                                />
                                            </>
                                        ) : (
                                            new Date(envio.fecha_entrega_estimada).toLocaleDateString('es-AR')
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        {estaEditando ? (
                                            <>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === envio.id}
                                                    onClick={() => handleGuardarCambios(envio.id)}
                                                    aria-label={`Guardar cambios del envío ${envio.codigo_seguimiento}`}
                                                    className="text-sm bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                                                >
                                                    {cargandoId === envio.id ? '...' : 'Guardar'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === envio.id}
                                                    onClick={() => { setIdFilaEditando(null); setValoresEditando(null); }}
                                                    aria-label={`Cancelar edición del envío ${envio.codigo_seguimiento}`}
                                                    className="text-sm bg-muted text-foreground font-bold px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                                                >
                                                    X
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === envio.id}
                                                    onClick={() => iniciarEdicion(envio)}
                                                    aria-label={`Editar envío ${envio.codigo_seguimiento}`}
                                                    className="text-sm bg-muted hover:bg-muted/80 text-foreground font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === envio.id}
                                                    onClick={() => handleCancelarEnvio(envio.id)}
                                                    aria-label={`Cancelar despacho del envío ${envio.codigo_seguimiento}`}
                                                    className="text-sm bg-red-100 hover:bg-red-200 text-red-900 font-bold px-3 py-1.5 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                                                >
                                                    {cargandoId === envio.id ? '...' : 'Cancelar'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL */}
            <div className="md:hidden space-y-4">
                {envios.map((envio) => (
                    <div key={envio.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-foreground uppercase font-bold tracking-wider">Seguimiento</span>
                                <h3 className="font-mono text-base font-bold text-foreground">#{envio.codigo_seguimiento}</h3>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${colorEstado(envio.estado)}`}>
                                {envio.estado}
                            </span>
                        </div>
                        <div className="border-t border-border pt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground font-medium">Empresa:</span>
                                <span className="font-bold text-foreground">{envio.empresa?.nombre || 'No asignado'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground font-medium">Destino:</span>
                                <span className="text-foreground text-right">{envio.direccionDestino.ciudad}, {envio.direccionDestino.provincia}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-foreground font-medium">Estimado:</span>
                                <span className="font-bold text-primary">{new Date(envio.fecha_entrega_estimada).toLocaleDateString('es-AR')}</span>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                                <button 
                                    type="button"
                                    disabled={cargandoId === envio.id}
                                    onClick={() => handleCancelarEnvio(envio.id)}
                                    aria-label={`Cancelar despacho móvil del envío ${envio.codigo_seguimiento}`}
                                    className="w-full text-center bg-red-100 text-red-900 py-3 rounded-lg font-bold text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                >
                                    Cancelar Despacho
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN CON ACCIÓN */}
            {estadoPaginacion && estadoPaginacion.totalPaginas > 1 && (
                <nav aria-label="Paginación de envíos" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                    <p className="text-base text-foreground">
                        Mostrando página <span className="font-bold">{estadoPaginacion.pagina}</span> de <span className="font-bold">{estadoPaginacion.totalPaginas}</span>
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            disabled={estadoPaginacion.pagina <= 1 || cargandoPagina}
                            onClick={() => handleCambiarPagina(estadoPaginacion.pagina - 1)}
                            aria-label="Ir a la página anterior de envíos"
                            className="flex-1 sm:flex-none px-5 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={estadoPaginacion.pagina >= estadoPaginacion.totalPaginas || cargandoPagina}
                            onClick={() => handleCambiarPagina(estadoPaginacion.pagina + 1)}
                            aria-label="Ir a la siguiente página de envíos"
                            className="flex-1 sm:flex-none px-5 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            Siguiente
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}