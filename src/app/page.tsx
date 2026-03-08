import { getUser } from "@/lib/supabase/auth-actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect("/cars");
  } else {
    redirect("/login");
  }
}
