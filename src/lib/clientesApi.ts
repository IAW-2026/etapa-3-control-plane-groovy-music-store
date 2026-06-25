import { auth } from '@clerk/nextjs/server'

export class ErrorApi extends Error {
    codigo: string

    constructor(codigo: string, mensaje: string) {
        super(mensaje)
        this.codigo = codigo
    }
}

interface OpcionesFetch {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
}

async function clienteApi<T>(
    baseUrl: string,
    path: string,
    opciones: OpcionesFetch = {}
): Promise<T> {
    const { getToken } = await auth()
    const token = await getToken()

    const respuesta = await fetch(`${baseUrl}${path}`, {
        method: opciones.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: opciones.body ? JSON.stringify(opciones.body) : undefined,
        cache: 'no-store',
    })

    const datos = await respuesta.json().catch(() => null)

    if (!respuesta.ok) {
        const codigo = datos?.error ?? 'error_desconocido'
        const mensaje =
            datos?.mensaje ?? `Error ${respuesta.status} al llamar a ${baseUrl}${path}`
        throw new ErrorApi(codigo, mensaje)
    }

    return datos as T
}

export function fetchPayments<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.PAYMENTS_API_URL!, path, opciones)
}

export function fetchBuyer<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.BUYER_API_URL!, path, opciones)
}

export function fetchSeller<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.SELLER_API_URL!, path, opciones)
}

export function fetchShipping<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.SHIPPING_API_URL!, path, opciones)
}