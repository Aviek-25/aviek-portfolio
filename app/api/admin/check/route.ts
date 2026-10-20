
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { authorized: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const userEmail = user.email?.trim().toLowerCase();

    if (!adminEmail || !userEmail || userEmail !== adminEmail) {
      return NextResponse.json(
        { authorized: false, error: "Not authorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { authorized: true },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Admin authorization check failed:", error);

    return NextResponse.json(
      { authorized: false, error: "Authorization check failed" },
      { status: 500 }
    );
  }
}
