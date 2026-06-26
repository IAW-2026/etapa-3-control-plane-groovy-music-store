'use client';

import { useState } from 'react';
import { eliminarEmpresaAction, crearEmpresaAction, modificarEmpresaAction } from './actions';

interface Empresa {
    id: string;
    nombre: string;
    totalEnvios: number;
    totalUsuarios: number;
}

export default function TablaEmpresas({ datosIniciales }: { datosIniciales: Empresa[] }) {
    const [empresas, setEmpresas] = useState<Empresa[]>(datosIniciales);
    const [cargandoId, setCargandoId] = useState<string | null>(null);
    
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [creando, setCreando] = useState(false);

    const [idEditando, setIdEditando] = useState<string | null>(null);
    const [nombreEditando, setNombreEditando] = useState('');

    const iniciarEdicion = (empresa: Empresa) => {
        setIdEditando(empresa.id);
        setNombreEditando(empresa.nombre);
    };

    const handleGuardarEdicion = async (id: string) => {
        if (!nombreEditando.trim()) return;
        setCargandoId(id);
        try {
            const res = await modificarEmpresaAction(id, { nombre: nombreEditando.trim() });
            if (res.success) {
                setEmpresas(prev => prev.map(emp => 
                    emp.id === id ? { ...emp, nombre: nombreEditando.trim() } : emp
                ));
                setIdEditando(null);
            } else {
                alert(res.error || 'Error al actualizar la empresa');
            }
        } catch (error) {
            alert('Error de conexión al guardar los cambios.');
        } finally {
            setCargandoId(null);
        }
    };

    const handleEliminarEmpresa = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta empresa de logística de forma permanente?')) {
            setCargandoId(id);
            try {
                const res = await eliminarEmpresaAction(id);
                if (res.success) {
                    setEmpresas(prev => prev.filter(emp => emp.id !== id));
                } else {
                    alert(res.error || 'No se pudo eliminar la empresa.');
                }
            } catch (error) {
                alert('Ocurrió un error en la conexión con el servicio.');
            } finally {
                setCargandoId(null);
            }
        }
    };

    const handleCrearEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoNombre.trim()) return;

        setCreando(true);
        try {
            const res = await crearEmpresaAction({ nombre: nuevoNombre.trim() });
            if (res.success && res.datos) {
                const nuevaEmpresa: Empresa = {
                    id: res.datos.id,
                    nombre: res.datos.nombre,
                    totalEnvios: 0,
                    totalUsuarios: 0
                };
                setEmpresas(prev => [...prev, nuevaEmpresa]);
                setNuevoNombre('');
            } else {
                alert(res.error || 'Error al registrar la empresa');
            }
        } catch (error) {
            alert('Error de conexión al intentar crear la empresa.');
        } finally {
            setCreando(false);
        }
    };

    return (
        <div className="space-y-6 font-dm">
            {/* VISTA DESKTOP */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground bg-muted/20">
                            <th scope="col" className="p-4 font-bold">Razón Social / Nombre</th>
                            <th scope="col" className="p-4 font-bold">Despachos Totales</th>
                            <th scope="col" className="p-4 font-bold">Operadores Asociados</th>
                            <th scope="col" className="p-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {empresas.map((empresa) => {
                            const estaEditando = idEditando === empresa.id;
                            return (
                                <tr key={empresa.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-4 font-medium">
                                        {estaEditando ? (
                                            <>
                                                <label htmlFor={`edit-nombre-${empresa.id}`} className="sr-only">
                                                    Modificar nombre de la empresa
                                                </label>
                                                <input 
                                                    id={`edit-nombre-${empresa.id}`}
                                                    type="text"
                                                    aria-required="true"
                                                    className="bg-background border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold w-full max-w-xs text-foreground"
                                                    value={nombreEditando}
                                                    onChange={(e) => setNombreEditando(e.target.value)}
                                                    disabled={cargandoId === empresa.id}
                                                />
                                            </>
                                        ) : (
                                            <span className="text-foreground font-bold">{empresa.nombre}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-foreground font-mono text-sm">{empresa.totalEnvios} envíos</td>
                                    <td className="p-4 text-foreground font-mono text-sm">{empresa.totalUsuarios} usuarios</td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap" aria-live="polite">
                                        {estaEditando ? (
                                            <>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === empresa.id || !nombreEditando.trim()}
                                                    onClick={() => handleGuardarEdicion(empresa.id)}
                                                    aria-label={`Guardar cambios para ${empresa.nombre}`}
                                                    className="text-sm bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 focus:ring-2 focus:ring-primary focus:outline-none"
                                                >
                                                    {cargandoId === empresa.id ? '...' : 'Guardar'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === empresa.id}
                                                    onClick={() => setIdEditando(null)}
                                                    aria-label="Cancelar edición"
                                                    className="text-sm bg-muted text-foreground font-bold px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-all focus:ring-2 focus:ring-muted focus:outline-none"
                                                >
                                                    X
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === empresa.id}
                                                    onClick={() => iniciarEdicion(empresa)}
                                                    aria-label={`Editar nombre de ${empresa.nombre}`}
                                                    className="text-sm bg-muted hover:bg-muted/80 text-foreground font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-muted focus:outline-none transition-all"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={cargandoId === empresa.id}
                                                    onClick={() => handleEliminarEmpresa(empresa.id)}
                                                    aria-label={`Eliminar empresa ${empresa.nombre}`}
                                                    className="text-sm bg-red-100 hover:bg-red-200 text-red-900 font-bold px-3 py-1.5 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
                                                >
                                                    {cargandoId === empresa.id ? '...' : 'Eliminar'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* FORMULARIO DE CREACIÓN (POST) */}
                        <tr className="bg-muted/10">
                            <td className="p-4" colSpan={3}>
                                <form id="form-crear-empresa" onSubmit={handleCrearEmpresa} className="w-full max-w-md">
                                    <label htmlFor="input-nueva-empresa" className="sr-only">
                                        Nombre de la nueva empresa operativa
                                    </label>
                                    <input 
                                        id="input-nueva-empresa"
                                        type="text"
                                        aria-required="true"
                                        placeholder="Nombre de la nueva empresa operativa..."
                                        value={nuevoNombre}
                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                        disabled={creando}
                                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-foreground/60 font-bold text-foreground"
                                    />
                                </form>
                            </td>
                            <td className="p-4 text-right align-middle">
                                <button
                                    form="form-crear-empresa"
                                    type="submit"
                                    disabled={creando || !nuevoNombre.trim()}
                                    className="text-sm bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    {creando ? 'Creando...' : 'Añadir Empresa'}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL */}
            <div className="md:hidden space-y-4">
                {empresas.map((empresa) => {
                    const estaEditando = idEditando === empresa.id;
                    return (
                        <div key={empresa.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                            <div aria-live="polite">
                                {estaEditando ? (
                                    <div className="flex gap-2 items-center mt-1">
                                        <label htmlFor={`edit-nombre-movil-${empresa.id}`} className="sr-only">
                                            Modificar nombre de la empresa en vista móvil
                                        </label>
                                        <input 
                                            id={`edit-nombre-movil-${empresa.id}`}
                                            type="text"
                                            aria-required="true"
                                            className="bg-background border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold flex-1 text-foreground"
                                            value={nombreEditando}
                                            onChange={(e) => setNombreEditando(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => handleGuardarEdicion(empresa.id)}
                                            aria-label={`Confirmar nuevo nombre para ${empresa.nombre}`}
                                            className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm font-bold focus:ring-2 focus:ring-primary"
                                        >
                                            ✓
                                        </button>
                                        <button 
                                            onClick={() => setIdEditando(null)}
                                            aria-label="Cancelar cambios"
                                            className="bg-muted text-foreground px-3 py-2 rounded text-sm font-bold focus:ring-2 focus:ring-muted"
                                        >
                                            X
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-foreground text-base">{empresa.nombre}</h3>
                                        <p className="font-mono text-sm text-foreground/80 mt-0.5">ID: {empresa.id}</p>
                                    </>
                                )}
                            </div>
                            <div className="border-t border-border pt-3 flex flex-col gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground font-medium">Envíos gestionados:</span>
                                    <span className="font-bold text-foreground">{empresa.totalEnvios}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground font-medium">Operadores:</span>
                                    <span className="font-bold text-foreground">{empresa.totalUsuarios}</span>
                                </div>
                                {!estaEditando && (
                                    <div className="flex justify-end gap-2 pt-2 border-t border-border/50" aria-live="polite">
                                        <button 
                                            type="button"
                                            onClick={() => iniciarEdicion(empresa)} 
                                            aria-label={`Editar nombre de la transportista ${empresa.nombre}`}
                                            className="w-full text-center bg-muted py-3 rounded-lg font-bold text-sm text-foreground focus:ring-2 focus:ring-muted focus:outline-none"
                                        >
                                            Editar Nombre
                                        </button>
                                        <button 
                                            type="button"
                                            disabled={cargandoId === empresa.id}
                                            onClick={() => handleEliminarEmpresa(empresa.id)}
                                            aria-label={`Eliminar transportista ${empresa.nombre}`}
                                            className="w-full text-center bg-red-100 text-red-900 py-3 rounded-lg font-bold text-sm focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
                                        >
                                            {cargandoId === empresa.id ? '...' : 'Eliminar'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* FORMULARIO MÓVIL DE CREACIÓN */}
                <div className="bg-muted/20 border border-dashed border-border p-4 rounded-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Registrar Nueva Empresa</h3>
                    <form onSubmit={handleCrearEmpresa} className="space-y-3">
                        <label htmlFor="input-nueva-empresa-movil" className="sr-only">
                            Nombre de la transportista a añadir
                        </label>
                        <input 
                            id="input-nueva-empresa-movil"
                            type="text"
                            aria-required="true"
                            placeholder="Ej. Expreso Bahía"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            disabled={creando}
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-foreground"
                        />
                        <button
                            type="submit"
                            disabled={creando || !nuevoNombre.trim()}
                            className="w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm disabled:opacity-50 focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            {creando ? 'Registrando...' : 'Añadir Empresa'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}