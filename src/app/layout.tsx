import { ClerkProvider } from '@clerk/nextjs'
import Link from 'next/link';
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import MobileNav from './MobileNav';
import { cormorant, syne, dmSans } from './fonts';
import './globals.css'


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    const displayName = user?.firstName ?? 'Super Admin';

    const navItems = [
        { name: 'Dashboard Global', href: '/' },
        { name: 'Buyer App', href: '/buyer' },
        { name: 'Seller App', href: '/seller' },
        { name: 'Shipping App', href: '/shipping' },
        { name: 'Payments App', href: '/payments' },
    ];

    return (
        <ClerkProvider>
            <html lang="es">
                <body className={`flex min-h-screen bg-background text-foreground font-dm flex-col md:flex-row m-0 ${cormorant.variable} ${syne.variable} ${dmSans.variable}`}>
                    
                    {/* SIDEBAR — solo visible en desktop */}
                    <aside className="hidden md:flex w-64 sticky top-0 h-screen bg-foreground text-white/90 flex-col border-r border-[#3a3a3a]">
                        <div className="p-6 border-b border-[#3a3a3a]">
                            <h1 className="font-syne text-xl font-bold tracking-wider text-white m-0">
                                GROOVY
                            </h1>
                            <span className="text-[#F27A59] text-xs font-bold uppercase tracking-[0.2em]">
                                Control Plane
                            </span>
                        </div>

                        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-white/10 hover:text-white whitespace-nowrap"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-[#3a3a3a]">
                            <p className="text-xs text-white/70 mb-3 px-2">Sesión: {displayName}</p>
                            <SignOutButton redirectUrl="/sign-in">
                                <button className="w-full text-left px-4 py-2 text-sm text-[#F27A59] font-bold hover:bg-[#F27A59]/10 rounded-xl transition-colors">
                                    Cerrar sesión
                                </button>
                            </SignOutButton>
                        </div>
                    </aside>

                    {/* ÁREA DE CONTENIDO PRINCIPAL */}
                    <main className="flex-1 flex flex-col max-w-[100vw] md:max-w-[calc(100vw-16rem)]">
                        
                        {/* Navegación móvil (hamburguesa desplegable) */}
                        <MobileNav navItems={navItems} displayName={displayName} />

                        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                            {children}
                        </div>
                    </main>

                </body>
            </html>
        </ClerkProvider>
    );
}