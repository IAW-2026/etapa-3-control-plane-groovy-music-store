'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

interface NavItem {
    name: string
    href: string
}

interface MobileNavProps {
    navItems: NavItem[]
    displayName: string
}

export default function MobileNav({ navItems, displayName }: MobileNavProps) {
    const [abierto, setAbierto] = useState(false)
    const pathname = usePathname()

    return (
        <div className="md:hidden">
            {/* BARRA SUPERIOR FIJA */}
            <div className="flex items-center justify-between p-4 bg-foreground text-white border-b border-[#3a3a3a]">
                <div className="flex items-center gap-3">
                    <h1 className="font-syne text-lg font-bold tracking-wider text-white m-0">
                        GROOVY
                    </h1>
                    <span className="text-[#B83A15] text-[10px] font-bold uppercase tracking-[0.15em]">
                        Control Plane
                    </span>
                </div>

                <button
                    onClick={() => setAbierto(!abierto)}
                    aria-label={abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                    aria-expanded={abierto}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    {abierto ? (
                        // Ícono X
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Ícono hamburguesa
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* MENÚ DESPLEGABLE */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-foreground border-b border-[#3a3a3a] ${
                    abierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <nav className="flex flex-col gap-1 px-4 py-3">
                    {navItems.map((item) => {
                        const activo = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setAbierto(false)}
                                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                                    activo
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-4 py-3 border-t border-[#3a3a3a] flex items-center justify-between">
                    <span className="text-xs text-white/60">Sesión: {displayName}</span>
                    <SignOutButton redirectUrl="/sign-in">
                        <button className="text-xs text-[#B83A15] font-bold uppercase hover:bg-[#B83A15]/10 px-3 py-1.5 rounded-lg transition-colors">
                            Cerrar sesión
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    )
}
