'use server';

import { fetchShipping } from '@/lib/clientesApi';
import { revalidatePath } from 'next/cache';

/**
 * --- ACCIONES PARA ENVÍOS (SHIPMENTS) ---
 */

/**
 * Modifica el estado o la dirección de un envío desde el Control Plane.
 * Endpoint: PATCH /api/shipments/:id
 */
export async function modificarEnvioAction(id: string, datos: { estado?: string; direccionDestino?: any }) {
    try {
        const respuesta = await fetchShipping<any>(`/api/shipments/${id}`, {
            method: 'PATCH',
            body: datos,
        });

        revalidatePath('/shipping');
        return { success: true, datos: respuesta };
    } catch (error: any) {
        console.error("Error en Server Action modificarEnvioAction:", error);
        return {
            success: false,
            error: error.message || 'Error al modificar el envío.',
        };
    }
}

/**
 * Cancela/elimina un envío de manera permanente.
 * Endpoint: DELETE /api/shipments/:id
 */
export async function cancelarEnvioAction(id: string) {
    try {
        const respuesta = await fetchShipping<any>(`/api/shipments/${id}`, {
            method: 'DELETE',
        });

        revalidatePath('/shipping');
        return { success: true, datos: respuesta };
    } catch (error: any) {
        console.error("Error en Server Action cancelarEnvioAction:", error);
        return {
            success: false,
            error: error.message || 'Error al cancelar el envío.',
        };
    }
}

/**
 * Carga una página específica del catálogo de envíos (shipments).
 * Endpoint: GET /api/shipments?pagina=X&limite=5
 */
export async function cargarEnviosPagina(pagina: number) {
    try {
        const respuesta = await fetchShipping<any>(`/api/shipments?pagina=${pagina}&limite=5`, {
            method: 'GET'
        });
        return respuesta;
    } catch (error: any) {
        console.error("Error en Server Action cargarEnviosPagina:", error);
        throw new Error(error.message || "No se pudo recuperar la página de envíos.");
    }
}


/**
 * --- ACCIONES PARA EMPRESAS LOGÍSTICAS ---
 */

/**
 * Crea una nueva empresa logística en el sistema.
 * Endpoint: POST /api/empresas
 */
export async function crearEmpresaAction(datos: { nombre: string; cuit?: string; activa?: boolean }) {
    try {
        const respuesta = await fetchShipping<any>('/api/empresas', {
            method: 'POST',
            body: datos,
        });

        revalidatePath('/shipping');
        return { success: true, datos: respuesta };
    } catch (error: any) {
        console.error("Error en Server Action crearEmpresaAction:", error);
        return {
            success: false,
            error: error.message || 'Error al registrar la empresa.',
        };
    }
}

/**
 * Modifica los datos de una empresa de transporte.
 * Endpoint: PATCH /api/empresas/:id
 */
export async function modificarEmpresaAction(id: string, datos: { nombre?: string; cuit?: string; activa?: boolean }) {
    try {
        const respuesta = await fetchShipping<any>(`/api/empresas/${id}`, {
            method: 'PATCH',
            body: datos,
        });

        revalidatePath('/shipping');
        return { success: true, datos: respuesta };
    } catch (error: any) {
        console.error("Error en Server Action modificarEmpresaAction:", error);
        return {
            success: false,
            error: error.message || 'Error al actualizar la configuración de la empresa.',
        };
    }
}

/**
 * Elimina una empresa del catálogo logístico.
 * Endpoint: DELETE /api/empresas/:id
 */
export async function eliminarEmpresaAction(id: string) {
    try {
        const respuesta = await fetchShipping<any>(`/api/empresas/${id}`, {
            method: 'DELETE',
        });

        revalidatePath('/shipping');
        return { success: true, datos: respuesta };
    } catch (error: any) {
        console.error("Error en Server Action eliminarEmpresaAction:", error);
        return {
            success: false,
            error: error.message || 'Error al eliminar la empresa.',
        };
    }
}

/**
 * --- ACCIONES PARA OPERADORES LOGÍSTICOS ---
 */

/**
 * Recupera el listado completo de operadores logísticos desde el backend de Shipping.
 * Endpoint: GET /api/operadores
 */
export async function cargarOperadoresAction() {
    try {
        const respuesta = await fetchShipping<any>('/api/operadores', {
            method: 'GET'
        });
        return respuesta;
    } catch (error: any) {
        console.error("Error en Server Action cargarOperadoresAction:", error);
        throw new Error(error.message || "No se pudo recuperar el listado de operadores.");
    }
}

