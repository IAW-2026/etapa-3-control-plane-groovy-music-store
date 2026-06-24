import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


// Protegemos todas las rutas excepto el acceso denegado
const isProtectedRoute = createRouteMatcher([
    '/((?!sin-acceso).*)'
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const session = await auth()

        // Si no está logueado, lo manda al login de Clerk
        if (!session.userId) {
            await auth.protect()
        }

        // Chequeamos que tenga el rol super_admin en el token (metadata)
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
