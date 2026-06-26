import { Suspense } from 'react'
import SeccionDisputas from './SeccionDisputas'
import SeccionTransacciones from './SeccionTransacciones'
import TablaPayouts from './TablaPayouts'
import TablaPayoutsSkeleton from './TablaPayoutsSkeleton'
import { DisputasSkeleton, TransaccionesSkeleton } from './Skeletons'

export const metadata = {
    title: 'Gestión de Pagos - Control Plane',
    description: 'Monitorización de transacciones financieras, liquidaciones y resolución de disputas.',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PaymentsPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams
    const paginaPayouts = Number(searchParams?.pagina) || 1
    const limitePayouts = Number(searchParams?.limite) || 20

    return (
        <main className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
            {/* ENCABEZADO  */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Administración
                        <span className="block text-orange-700 text-xl md:text-2xl font-medium mt-1">Payments App</span>
                    </h1>
                    <p className="font-dm text-sm md:text-base text-foreground/80 max-w-lg">
                        Monitorización de transacciones financieras, liquidaciones y resolución de disputas.
                    </p>
                </div>

                <a
                    href="https://proyecto-c-payments-groovy-music-store.vercel.app/sign-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir el panel financiero externo de la Payments App en una nueva pestaña"
                    className="inline-flex items-center justify-center font-dm text-sm font-bold text-white bg-[#B83A15] hover:bg-[#E4572E] px-6 py-3 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-[#B83A15] focus:ring-offset-2 focus:outline-none w-full sm:w-auto"
                >
                    Panel Externo
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </header>

            <div className="space-y-10">
                {/* SECCIÓN DE DISPUTAS Y RECLAMOS (Métricas) */}
                <section aria-labelledby="disputas-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="disputas-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-amber-500 rounded-full inline-block" aria-hidden="true"></span>
                            Métricas de Disputas
                        </h2>
                    </div>

                    <Suspense fallback={<DisputasSkeleton />}>
                        <SeccionDisputas />
                    </Suspense>
                </section>

                {/* SECCIÓN DE TRANSACCIONES (Tabla/Tarjetas) */}
                <section aria-labelledby="transacciones-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="transacciones-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block" aria-hidden="true"></span>
                            Historial de Transacciones
                        </h2>
                    </div>

                    <Suspense fallback={<TransaccionesSkeleton />}>
                        <SeccionTransacciones />
                    </Suspense>
                </section>

                {/* SECCIÓN DE BALANCES DE VENDEDORES (Payouts) */}
                <section aria-labelledby="balances-titulo" className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 id="balances-titulo" className="font-syne text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" aria-hidden="true"></span>
                            Balances de Vendedores
                        </h2>
                    </div>

                    <Suspense fallback={<TablaPayoutsSkeleton />}>
                        <TablaPayouts pagina={paginaPayouts} limite={limitePayouts} />
                    </Suspense>
                </section>
            </div>
        </main>
    );
}