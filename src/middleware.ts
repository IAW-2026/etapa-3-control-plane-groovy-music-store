import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 1. Definimos explícitamente cuáles son las rutas públicas (el (.*) incluye cualquier parámetro)
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)', 
    '/sin-acceso(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    // 2. Si la ruta actual NO es pública, aplicamos las reglas de protección
    if (!isPublicRoute(req)) {
        const session = await auth()

        // Si no está logueado, lo mandamos a iniciar sesión
        if (!session.userId) {
            return session.redirectToSignIn()
        }

        // Chequeamos el rol super_admin
        const hasSuperAdminRole = session.sessionClaims?.roles?.includes('super_admin') ?? false

        if (!hasSuperAdminRole) {
            const url = new URL('/sin-acceso', req.url)
            return NextResponse.redirect(url)
        }
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}