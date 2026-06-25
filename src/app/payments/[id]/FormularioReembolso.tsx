'use client'

import { useActionState } from 'react'
import { emitirReembolso } from './acciones'

export function FormularioReembolso({ id }: { id: string }) {
    const accionConId = emitirReembolso.bind(null, id)
    const [estado, accion, pendiente] = useActionState(accionConId, {})

    return (
        <form action={accion} className="mt-6 space-y-3 border-t border-border pt-4 max-w-md">
            <h2 className="font-semibold">Emitir reembolso</h2>

            <div>
                <label htmlFor="monto" className="block text-sm text-muted">
                    Monto a reembolsar
                </label>
                <input
                    id="monto"
                    name="monto"
                    type="number"
                    step="0.01"
                    required
                    className="border border-border rounded px-2 py-1 w-full bg-card"
                />
            </div>

            <div>
                <label htmlFor="motivo" className="block text-sm text-muted">
                    Motivo (opcional)
                </label>
                <input
                    id="motivo"
                    name="motivo"
                    type="text"
                    className="border border-border rounded px-2 py-1 w-full bg-card"
                />
            </div>

            <button
                type="submit"
                disabled={pendiente}
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {pendiente ? 'Procesando...' : 'Confirmar reembolso'}
            </button>

            {estado.error && <p className="text-red-600 text-sm">{estado.error}</p>}
            {estado.exito && <p className="text-green-600 text-sm">{estado.exito}</p>}
        </form>
    )
}