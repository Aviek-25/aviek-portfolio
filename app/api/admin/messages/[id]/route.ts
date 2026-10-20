
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAuthorizedClient() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    return {
      error: NextResponse.json(
        { error: "Admin configuration is missing." },
        { status: 500 }
      ),
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      ),
    };
  }

  if (user.email?.trim().toLowerCase() !== adminEmail) {
    return {
      error: NextResponse.json(
        { error: "You are not authorized to perform this action." },
        { status: 403 }
      ),
    };
  }

  return { supabase };
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await getAuthorizedClient();

    if ("error" in auth) return auth.error;

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      !["read", "replied"].includes(String(body.status))
    ) {
      return NextResponse.json(
        { error: "Status must be read or replied." },
        { status: 400 }
      );
    }

    const status = body.status as "read" | "replied";

    const { data, error } = await auth.supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error("Update contact message failed:", error.message);
      return NextResponse.json(
        { error: "Could not update the message. Check database permissions." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Message not found or update not permitted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("PATCH contact message failed:", error);
    return NextResponse.json(
      { error: "Invalid request or server error." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await getAuthorizedClient();

    if ("error" in auth) return auth.error;

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Delete contact message failed:", error.message);
      return NextResponse.json(
        { error: "Could not delete the message. Check database permissions." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Message not found or deletion not permitted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: data.id });
  } catch (error) {
    console.error("DELETE contact message failed:", error);
    return NextResponse.json(
      { error: "Server error while deleting the message." },
      { status: 500 }
    );
  }
}
