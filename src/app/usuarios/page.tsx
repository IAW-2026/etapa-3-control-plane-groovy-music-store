import Link from "next/link";

export const metadata = {
    title: 'Gestión de Usuarios - Control Plane',
}

// Simulamos las funciones de tu helper clientesApi.ts
async function getBuyers() {
    // Acá iría el fetch real a tu API. Simulamos éxito.
    await new Promise(r => setTimeout(r, 1000));
    return [
        { id: "1", nombre: "Ana Paula", email: "ana@ejemplo.com", tipo: "Comprador", estado: "Activo" }
    ];
}


async function getSellers(): Promise<any[]> {
    await new Promise(r => setTimeout(r, 1500));
    throw new Error("API de Sellers no responde");
    
    // Esto nunca se ejecuta por el throw, pero TS lo necesita para saber qué forma tendría
    return []; 
}
export default async function UsuariosPage() {
    // Promise.allSettled ejecuta ambas peticiones a la vez, pero NO corta la ejecución si una falla
    const [buyersResponse, sellersResponse] = await Promise.allSettled([
        getBuyers(),
        getSellers()
    ]);

    const usuarios = [];
    const errores = [];

    // Evaluamos qué pasó con la API de Compradores (tuya)
    if (buyersResponse.status === 'fulfilled') {
        usuarios.push(...buyersResponse.value);
    } else {
        errores.push("Fallo al conectar con la Buyer App. Los compradores no se están mostrando.");
    }

    // Evaluamos qué pasó con la API de Vendedores (Juan Francisco)
    if (sellersResponse.status === 'fulfilled') {
        usuarios.push(...sellersResponse.value);
    } else {
        errores.push("Fallo al conectar con la Seller App. Los vendedores no se están mostrando.");
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Usuarios</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/80 text-base">
                    Gestión global de compradores y vendedores del ecosistema.
                </p>
                <div className="w-20 h-1 bg-[#B83A15] mt-4 rounded-full"></div>
            </header>

            {/* PANEL DE ALERTAS (Solo se muestra si hay errores) */}
            {errores.length > 0 && (
                <div className="mb-6 flex flex-col gap-2">
                    {errores.map((err, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="font-dm text-sm font-medium">{err}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* LA TABLA SE RENDERIZA IGUAL CON LOS DATOS QUE SÍ LLEGARON */}
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left font-dm text-sm">
                    {/* ... (el thead queda igual que en el código anterior) ... */}
                    <thead className="bg-slate-50 border-b border-border text-foreground/80 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-bold">Nombre</th>
                            <th className="px-6 py-4 font-bold">Email</th>
                            <th className="px-6 py-4 font-bold text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {usuarios.length > 0 ? (
                            usuarios.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">{user.nombre}</td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/usuarios/${user.tipo.toLowerCase()}/${user.id}`} className="inline-block bg-[#B83A15] text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-[#A33313] hover:scale-105 transition-all duration-200">
                                            Administrar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-slate-500 font-medium">
                                    No hay usuarios para mostrar en este momento.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}