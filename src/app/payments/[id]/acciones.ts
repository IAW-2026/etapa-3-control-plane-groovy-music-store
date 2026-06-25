'use server'

import { fetchPayments, ErrorApi } from '@/lib/clientesApi'
import { revalidatePath } from 'next/cache'

interface EstadoReembolso {
    error?: string
    exito?: string
}

interface RespuestaReembolso {
    transaccionId: string
    estado: string
    montoReembolsado: number
    montoAcreditarRestante: number
    mensaje: string
}

export async function emitirReembolso(
    id: string,
    _estadoAnterior: EstadoReembolso,
    formData: FormData
): Promise<EstadoReembolso> {
    const monto = Number(formData.get('monto'))
    const motivo = formData.get('motivo')?.toString() || undefined

    if (!monto || monto <= 0) {
        return { error: 'Ingresá un monto válido mayor a 0' }
    }

    try {
        const resultado = await fetchPayments<RespuestaReembolso>(
            `/api/payments/${id}/refund`,
            { method: 'POST', body: { monto, motivo } }
        )

        revalidatePath(`/payments/${id}`)
        revalidatePath('/payments')

        return { exito: resultado.mensaje }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Error al procesar el reembolso'
        return { error: mensaje }
    }
}

interface EstadoRelease {
    error?: string
    exito?: string
}

interface RespuestaRelease {
    transaccionId: string
    estado: string
    mensaje: string
}

export async function liberarFondos(
    id: string,
    _estadoAnterior: EstadoRelease,
    formData: FormData
): Promise<EstadoRelease> {
    const motivo = formData.get('motivo')?.toString() || undefined

    try {
        const resultado = await fetchPayments<RespuestaRelease>(
            `/api/payments/${id}/release`,
            { method: 'POST', body: { motivo } }
        )

        revalidatePath(`/payments/${id}`)
        revalidatePath('/payments')

        return { exito: resultado.mensaje }
    } catch (error) {
        const mensaje = error instanceof ErrorApi ? error.message : 'Error al liberar los fondos'
        return { error: mensaje }
    }
}