export default function UsuariosLoading() {
    return (
        <div className="max-w-7xl mx-auto animate-pulse">
            <header className="mb-10">
                <div className="h-10 w-64 bg-slate-200 rounded-md mb-2"></div>
                <div className="h-5 w-96 bg-slate-100 rounded-md"></div>
                <div className="w-20 h-1 bg-[#B83A15]/30 mt-4 rounded-full"></div>
            </header>

            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Cabecera de tabla simulada */}
                <div className="border-b border-border bg-slate-50 px-6 py-4 flex gap-4">
                    <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                </div>

                {/* Filas simuladas */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="px-6 py-4 flex gap-4 border-b border-slate-100">
                        <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                        <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                        <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded-md ml-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}