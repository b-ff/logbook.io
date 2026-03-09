import { getUser } from "@/lib/supabase/auth-actions";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth";
import { Car } from "lucide-react";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/cars");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
              <Car className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Logbook.io</h1>
          <p className="text-muted-foreground text-lg">
            Track your vehicle expenses with ease
          </p>
        </div>

        {/* Sign In Card */}
        <div className="rounded-lg border bg-card p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to access your vehicle logbook
            </p>
          </div>

          <GoogleSignInButton />

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl">⛽</div>
            <p className="text-sm text-muted-foreground">Fuel Tracking</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🔧</div>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">📊</div>
            <p className="text-sm text-muted-foreground">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
