export { }

declare global {
    interface CustomJwtSessionClaims {
        roles?: string[]
    }
}