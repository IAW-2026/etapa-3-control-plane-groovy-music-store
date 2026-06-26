import { SignJWT } from 'jose';

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
    secret: string, 
    opciones: OpcionesFetch = {}
): Promise<T> {
    
    
    if (!baseUrl || !secret) {
        console.error(`Faltan variables de entorno para llamar a: ${path}`);
        throw new ErrorApi('env_missing', 'Variables de entorno incompletas');
    }

    const encoder = new TextEncoder();
    const token = await new SignJWT({ 
        iss: 'control-plane',
        role: 'superadmin' 
    }) 
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m') 
        .sign(encoder.encode(secret));

    const respuesta = await fetch(`${baseUrl}${path}`, {
        method: opciones.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
        body: opciones.body ? JSON.stringify(opciones.body) : undefined,
        next: { revalidate: 1 },
    })

    const datos = await respuesta.json().catch(() => null)

    if (!respuesta.ok) {
        const codigo = datos?.error ?? 'error_desconocido'
        const mensaje = datos?.mensaje ?? `Error ${respuesta.status} al llamar a ${baseUrl}${path}`
        throw new ErrorApi(codigo, mensaje)
    }

    return datos as T
}

// --- EXPORTS DE CADA APP ---


export function fetchBuyer<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.BUYER_API_URL!, path, process.env.BUYER_JWT_SECRET!, opciones)
}

export function fetchSeller<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.SELLER_API_URL!, path, process.env.SELLER_JWT_SECRET!, opciones)
}

export function fetchShipping<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.SHIPPING_API_URL!, path, process.env.SHIPPING_JWT_SECRET!, opciones)
}

export function fetchPayments<T>(path: string, opciones?: OpcionesFetch) {
    return clienteApi<T>(process.env.PAYMENTS_API_URL!, path, process.env.PAYMENTS_JWT_SECRET!, opciones)
}