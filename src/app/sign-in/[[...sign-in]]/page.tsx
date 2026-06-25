import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md flex justify-center">
        <SignIn 
          routing="path" 
          path="/sign-in" 
          fallbackRedirectUrl="/" // Al loguearse con éxito, va a la raíz a re-evaluar el middleware
        />
      </div>
    </main>
  );
}