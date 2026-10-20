
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is not configured in .env.local");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  const email = user.email?.trim().toLowerCase();

  if (!email || email !== adminEmail) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    userId: user.id,
    email,
  };
}
