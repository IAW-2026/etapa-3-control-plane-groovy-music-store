'use server';

import { fetchBuyer } from "@/lib/clientesApi";

export async function cargarOrdenesPagina(pagina: number) {
    return await fetchBuyer<any>(`/api/orders?page=${pagina}&limit=10`);
}

export async function actualizarEstadoOrden(id: string, nuevoEstado: string) {
    return await fetchBuyer<any>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: { estado: nuevoEstado }
    });
}

export async function cargarUsuariosPagina(pagina: number) {
    return await fetchBuyer<any>(`/api/users?page=${pagina}&limit=10`);
}

export async function actualizarEstadoUsuario(clerkId: string, activo: boolean) {
    return await fetchBuyer<any>(`/api/users/${clerkId}`, {
        method: 'PATCH',
        body: { activo }
    });
}