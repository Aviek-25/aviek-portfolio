
import { NextResponse } from "next/server";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await connection();

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          authenticated: false,
          isAdmin: false,
        },
        { status: 401 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const userEmail = user.email
      ?.trim()
      .toLowerCase();

    if (!adminEmail) {
      console.error(
        "ADMIN_EMAIL environment variable is not configured."
      );

      return NextResponse.json(
        {
          authenticated: true,
          isAdmin: false,
          error: "Admin configuration is missing.",
        },
        { status: 500 }
      );
    }

    if (!userEmail || userEmail !== adminEmail) {
      return NextResponse.json(
        {
          authenticated: true,
          isAdmin: false,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      isAdmin: true,
      email: userEmail,
    });
  } catch (error) {
    console.error("Admin authorization check failed:", error);

    return NextResponse.json(
      {
        authenticated: false,
        isAdmin: false,
        error: "Unable to verify admin access.",
      },
      { status: 500 }
    );
  }
}
