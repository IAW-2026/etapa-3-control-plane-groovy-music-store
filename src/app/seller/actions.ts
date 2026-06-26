'use server';

// Asegúrate de que la ruta de importación coincida con donde tienes tu clienteApi
import { fetchSeller } from "@/lib/clientesApi"; 
import { revalidatePath } from "next/cache";

/**
 * Carga una página específica del catálogo de productos.
 */
export async function cargarProductosPagina(pagina: number) {
    try {
       
        const respuesta = await fetchSeller<any>(`/api/admin/products?pagina=${pagina}&limite=5`);
        return respuesta;
    } catch (error: any) {
        console.error("Error en Server Action cargarProductosPagina:", error);
        throw new Error(error.message || "No se pudo recuperar la página de productos.");
    }
}

/**
 * Actualiza cualquier campo permitido de un producto (incluido el estado 'activo')
 * desde el panel de administración global.
 */
export async function actualizarProductoAdmin(id: string, camposAActualizar: Record<string, any>) {
    try {
        // Enviamos el objeto con los campos directamente en el body
        const respuesta = await fetchSeller<any>(`/api/admin/products/${id}`, {
            method: 'PATCH',
            body: camposAActualizar,
        });

        // Revalida el caché para mantener los datos frescos
        revalidatePath('/admin/sellers'); // Ajusta a la ruta real de tu frontend
        
        return respuesta;
    } catch (error: any) {
        console.error("Error en Server Action actualizarProductoAdmin:", error);
        throw new Error(error.message || "No se pudieron guardar los cambios en el servidor.");
    }
}

/**
 * Carga una página específica de la lista de vendedores.
 */
export async function cargarVendedoresPagina(pagina: number) {
    try {
        const respuesta = await fetchSeller<any>(`/api/admin/sellers?pagina=${pagina}&limite=10`);
        return respuesta;
    } catch (error: any) {
        console.error("Error en Server Action cargarVendedoresPagina:", error);
        throw new Error(error.message || "No se pudo recuperar la página de vendedores.");
    }
}