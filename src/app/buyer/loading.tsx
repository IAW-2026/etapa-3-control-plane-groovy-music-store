export default function BuyerLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-6 lg:p-8 animate-pulse">
            {/* Simulación del encabezado */}
            <div className="space-y-3 pb-6 border-b border-border">
                <div className="h-8 bg-muted rounded-lg w-1/4"></div>
                <div className="h-4 bg-muted rounded-lg w-2/4"></div>
            </div>

            {/* Simulación de las dos secciones de tablas */}
            <div className="space-y-10">
                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                    <div className="h-6 bg-muted rounded-md w-1/5 mb-4"></div>
                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                    <div className="h-6 bg-muted rounded-md w-1/5 mb-4"></div>
                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                </div>
            </div>
        </div>
    );
}