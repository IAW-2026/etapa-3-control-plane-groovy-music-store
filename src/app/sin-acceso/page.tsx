"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SinAccesoPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleCerrarSesion = async () => {
    // 1. Esperamos a que Clerk destruya la sesión por completo
    await signOut();
    // 2. Recién cuando termina, forzamos la redirección
    router.push("/sign-in");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
        
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Acceso Restringido
        </h1>
        
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Tu cuenta actual no cuenta con el rol de <span className="font-semibold text-slate-700">super_admin</span> necesario para operar este panel de control global.
        </p>

        {/* Reemplazamos el componente de Clerk por un botón estándar con onClick */}
        <button 
          onClick={handleCerrarSesion}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cerrar sesión y reintentar
        </button>
      </div>
    </main>
  );
}