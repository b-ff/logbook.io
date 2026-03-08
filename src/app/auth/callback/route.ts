import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/cars";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Create or update profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || null,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
