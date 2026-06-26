'use client';

import { useState } from 'react';

interface Empresa {
    id: string;
    nombre: string;
}

interface Operador {
    id_clerk: string;
    mail: string;
    role: string;
    empresa: Empresa;
}

export default function TablaOperadores({ datosIniciales }: { datosIniciales: Operador[] }) {
    const [operadores] = useState<Operador[]>(datosIniciales);
    const [paginaActual, setPaginaActual] = useState(1);
    const limitePorPagina = 5;

    const totalOperadores = operadores.length;
    const totalPaginas = Math.ceil(totalOperadores / limitePorPagina);
    
    const indiceInicial = (paginaActual - 1) * limitePorPagina;
    const indiceFinal = indiceInicial + limitePorPagina;
    const operadoresVisibles = operadores.slice(indiceInicial, indiceFinal);

    if (totalOperadores === 0) {
        return (
            <p className="font-dm text-base text-foreground p-4 text-center bg-muted/30 rounded-lg">
                No se registran operadores ni usuarios asignados en el sistema.
            </p>
        );
    }

    return (
        <div className="space-y-6 font-dm">
            {/* VISTA DESKTOP */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground bg-muted/20">
                            <th scope="col" className="p-4 font-bold">Correo Electrónico</th>
                            <th scope="col" className="p-4 font-bold">Rol Asignado</th>
                            <th scope="col" className="p-4 font-bold">Empresa de Logística</th>
                            <th scope="col" className="p-4 font-bold text-right">Identificador Interno</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-border">
                        {operadoresVisibles.map((operador) => (
                            <tr key={operador.id_clerk} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 text-foreground font-bold">{operador.mail}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300">
                                        {operador.role}
                                    </span>
                                </td>
                                <td className="p-4 text-foreground font-bold">{operador.empresa?.nombre}</td>
                                <td className="p-4 text-right text-foreground font-mono text-sm">
                                    {operador.id_clerk}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL */}
            <div className="md:hidden space-y-4">
                {operadoresVisibles.map((operador) => (
                    <div key={operador.id_clerk} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="break-all pr-2">
                                <h3 className="font-bold text-foreground text-base">{operador.mail}</h3>
                                <p className="font-mono text-xs text-foreground/80 mt-0.5">Clerk: {operador.id_clerk}</p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-blue-100 text-blue-900 border-blue-300">
                                {operador.role}
                            </span>
                        </div>
                        <div className="border-t border-border pt-3 flex flex-col gap-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground font-medium">Organización:</span>
                                <span className="font-bold text-foreground">{operador.empresa?.nombre}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <nav aria-label="Paginación de operadores" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                    <p className="text-base text-foreground">
                        Mostrando operadores <span className="font-bold">{indiceInicial + 1}</span> al <span className="font-bold">{Math.min(indiceFinal, totalOperadores)}</span> de <span className="font-bold">{totalOperadores}</span>
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            disabled={paginaActual === 1}
                            onClick={() => setPaginaActual(prev => prev - 1)}
                            aria-label="Ir a la página anterior de operadores"
                            className="flex-1 sm:flex-none px-5 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={paginaActual >= totalPaginas}
                            onClick={() => setPaginaActual(prev => prev + 1)}
                            aria-label="Ir a la siguiente página de operadores"
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