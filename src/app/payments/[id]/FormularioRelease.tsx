'use client'

import { useActionState } from 'react'
import { liberarFondos } from './acciones'

export function FormularioRelease({ id }: { id: string }) {
    const accionConId = liberarFondos.bind(null, id)
    const [estado, accion, pendiente] = useActionState(accionConId, {})

    return (
        <form action={accion} className="mt-6 space-y-3 border-t border-border pt-4 max-w-md">
            <h2 className="font-semibold">Liberar fondos al vendedor</h2>

            <div>
                <label htmlFor="motivo-release" className="block text-sm text-muted">
                    Motivo (opcional)
                </label>
                <input
                    id="motivo-release"
                    name="motivo"
                    type="text"
                    className="border border-border rounded px-2 py-1 w-full bg-card"
                />
            </div>

            <button
                type="submit"
                disabled={pendiente}
                aria-label="Liberar fondos al vendedor manualmente"
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {pendiente ? 'Procesando...' : 'Liberar fondos'}
            </button>

            {estado.error && <p className="text-red-600 text-sm">{estado.error}</p>}
            {estado.exito && <p className="text-green-600 text-sm">{estado.exito}</p>}
        </form>
    )
}