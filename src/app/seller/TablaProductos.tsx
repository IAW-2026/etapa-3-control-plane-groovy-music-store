'use client';

import { useState } from 'react';
import { cargarProductosPagina, actualizarProductoAdmin } from './actions';

interface Paginacion {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

export default function TablaProductos({ 
    datosIniciales, 
    paginacion 
}: { 
    datosIniciales: any[], 
    paginacion?: Paginacion 
}) {
    const [productos, setProductos] = useState(datosIniciales);
    const [estadoPaginacion, setEstadoPaginacion] = useState(paginacion);
    
    // Estados para controlar qué fila está en modo edición y sus valores temporales
    const [idFilaEditando, setIdFilaEditando] = useState<string | null>(null);
    const [valoresEditando, setValoresEditando] = useState<{ titulo: string; precio: number; stock: number } | null>(null);
    
    const [cargandoId, setCargandoId] = useState<string | null>(null);
    const [cargandoPagina, setCargandoPagina] = useState(false);

    // 1. Manejo rápido para cambiar solo el interruptor de Activo/Inactivo
    const handleAlternarEstado = async (id: string, estadoActual: boolean) => {
        setCargandoId(id);
        const nuevoEstado = !estadoActual;
        try {
            await actualizarProductoAdmin(id, { activo: nuevoEstado });
            setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: nuevoEstado } : p));
        } catch (error) {
            alert('No se pudo actualizar el estado del producto');
        } finally {
            setCargandoId(null);
        }
    };

    // 2. Iniciar el modo edición para una fila copiando los datos actuales
    const iniciarEdicion = (producto: any) => {
        setIdFilaEditando(producto.id);
        setValoresEditando({
            titulo: producto.titulo,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    // 3. Guardar los campos de texto/número modificados en la fila
    const guardarCambiosCampos = async (id: string) => {
        if (!valoresEditando) return;
        setCargandoId(id);
        try {
            // Mandamos los campos editados en lote a tu API PATCH
            await actualizarProductoAdmin(id, valoresEditando);
            
            setProductos(prev => prev.map(p => p.id === id ? { ...p, ...valoresEditando } : p));
            setIdFilaEditando(null);
            setValoresEditando(null);
        } catch (error) {
            alert('Error al guardar las modificaciones del producto');
        } finally {
            setCargandoId(null);
        }
    };

    const handleCambiarPagina = async (nuevaPagina: number) => {
        setCargandoPagina(true);
        try {
            const respuesta = await cargarProductosPagina(nuevaPagina);
            if (respuesta && respuesta.datos) {
                setProductos(respuesta.datos);
                setEstadoPaginacion(respuesta.paginacion);
            }
        } catch (error) {
            alert('Error al cargar la página de productos');
        } finally {
            setCargandoPagina(false);
        }
    };

    if (!productos || productos.length === 0) {
        return <p className="font-dm text-sm text-foreground/60 p-4 text-center bg-muted/30 rounded-lg">No hay productos en el catálogo.</p>;
    }

    const paginaActual = estadoPaginacion?.pagina || 1;
    const totalPaginas = estadoPaginacion?.totalPaginas || 1;

    return (
        <div className="space-y-6 font-dm relative">
            {cargandoPagina && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl" aria-live="polite">
                    <div className="bg-card border border-border px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-pulse text-foreground flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Actualizando catálogo...
                    </div>
                </div>
            )}

            {/* VISTA MÓVIL Y ESCRITORIO */}
            <div className="grid gap-4 md:block overflow-x-auto">
                <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                        <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-foreground/60 bg-muted/20">
                            <th scope="col" className="p-4 font-semibold">Producto</th>
                            <th scope="col" className="p-4 font-semibold">Precio</th>
                            <th scope="col" className="p-4 font-semibold">Stock</th>
                            <th scope="col" className="p-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {productos.map((producto) => {
                            const estaEditando = idFilaEditando === producto.id;

                            return (
                                <tr key={producto.id} className="hover:bg-muted/30 transition-colors group">
                                    {/* COLUMNA: TÍTULO */}
                                    <td className="p-4 font-medium text-foreground">
                                        {estaEditando ? (
                                            <input 
                                                type="text"
                                                className="bg-background border border-input rounded px-2 py-1 text-sm w-full max-w-xs focus:ring-1 focus:ring-primary focus:outline-none"
                                                value={valoresEditando?.titulo || ''}
                                                onChange={e => setValoresEditando(prev => prev ? { ...prev, titulo: e.target.value } : null)}
                                            />
                                        ) : (
                                            producto.titulo
                                        )}
                                    </td>
                                    
                                    {/* COLUMNA: PRECIO */}
                                    <td className="p-4 font-bold text-foreground">
                                        {estaEditando ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-foreground/50">$</span>
                                                <input 
                                                    type="number"
                                                    className="bg-background border border-input rounded px-2 py-1 text-sm w-20 font-bold focus:ring-1 focus:ring-primary focus:outline-none"
                                                    value={valoresEditando?.precio ?? 0}
                                                    onChange={e => setValoresEditando(prev => prev ? { ...prev, precio: Number(e.target.value) } : null)}
                                                />
                                            </div>
                                        ) : (
                                            `$${Number(producto.precio).toFixed(2)}`
                                        )}
                                    </td>
                                    
                                    {/* COLUMNA: STOCK */}
                                    <td className="p-4 text-foreground/80">
                                        {estaEditando ? (
                                            <input 
                                                type="number"
                                                className="bg-background border border-input rounded px-2 py-1 text-sm w-16 focus:ring-1 focus:ring-primary focus:outline-none"
                                                value={valoresEditando?.stock ?? 0}
                                                onChange={e => setValoresEditando(prev => prev ? { ...prev, stock: Math.max(0, parseInt(e.target.value) || 0) } : null)}
                                            />
                                        ) : (
                                            `${producto.stock} un.`
                                        )}
                                    </td>
                                    
                                    {/* COLUMNA: ACCIONES EN FILA */}
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        {estaEditando ? (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={cargandoId === producto.id}
                                                    onClick={() => guardarCambiosCampos(producto.id)}
                                                    className="px-2.5 py-1.5 bg-primary text-primary-foreground font-semibold text-xs rounded hover:bg-primary/90 transition-colors"
                                                >
                                                    {cargandoId === producto.id ? '...' : 'Guardar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={cargandoId === producto.id}
                                                    onClick={() => { setIdFilaEditando(null); setValoresEditando(null); }}
                                                    className="px-2.5 py-1.5 bg-muted text-muted-foreground font-semibold text-xs rounded hover:bg-muted/80 transition-colors"
                                                >
                                                    X
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={cargandoId === producto.id || cargandoPagina}
                                                    onClick={() => iniciarEdicion(producto)}
                                                    className="px-2.5 py-1.5 bg-secondary text-secondary-foreground font-semibold text-xs rounded hover:bg-secondary/80 border border-border opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={cargandoId === producto.id || cargandoPagina}
                                                    onClick={() => handleAlternarEstado(producto.id, producto.activo)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block ${
                                                        producto.activo 
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200' 
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                                    } disabled:opacity-50`}
                                                >
                                                    {cargandoId === producto.id ? '...' : (producto.activo ? 'Activo' : 'Inactivo')}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Tarjetas para vista móvil (Mantiene la edición vía interruptor rápido activo) */}
                <div className="md:hidden space-y-4">
                     {productos.map((producto) => (
                        <div key={producto.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Producto</span>
                                    <p className="font-medium text-sm">{producto.titulo}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Precio</span>
                                    <p className="font-bold text-lg">${Number(producto.precio).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-border pt-3">
                                 <span className="text-xs font-medium text-foreground/80">
                                    Stock: {producto.stock}
                                </span>
                                <button
                                    type="button"
                                    disabled={cargandoId === producto.id || cargandoPagina}
                                    onClick={() => handleAlternarEstado(producto.id, producto.activo)}
                                    className={`px-3 py-1 rounded text-xs font-bold ${
                                        producto.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {cargandoId === producto.id ? '...' : (producto.activo ? 'Activo' : 'Inactivo')}
                                </button>
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <nav aria-label="Paginación de productos" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
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