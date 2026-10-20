
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admins";
import { createClient } from "@/lib/supabase/server";

type MessageStatus = "new" | "read" | "replied" | "archived";

function isMessageStatus(value: unknown): value is MessageStatus {
  return (
    typeof value === "string" &&
    ["new", "read", "replied", "archived"].includes(value)
  );
}

export async function GET() {
  try {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, name, email, subject, message, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to fetch messages:", error.message);

      return NextResponse.json(
        { error: "Unable to load contact messages." },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    console.error("Admin messages GET failed:", error);

    return NextResponse.json(
      { error: "Unauthorized or unable to load messages." },
      { status: 401 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required in the ?id= parameter." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      !isMessageStatus(body.status)
    ) {
      return NextResponse.json(
        { error: "Invalid status. Use new, read, replied, or archived." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status: body.status })
      .eq("id", id)
      .select("id, name, email, subject, message, status, created_at")
      .maybeSingle();

    if (error) {
      console.error("Unable to update message:", error.message);

      return NextResponse.json(
        { error: "Unable to update the message." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Message not found or update not permitted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error("Admin messages PATCH failed:", error);

    return NextResponse.json(
      { error: "Unauthorized or unable to update the message." },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required in the ?id= parameter." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Unable to delete message:", error.message);

      return NextResponse.json(
        { error: "Unable to delete the message." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Message not found or deletion not permitted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Admin messages DELETE failed:", error);

    return NextResponse.json(
      { error: "Unauthorized or unable to delete the message." },
      { status: 401 }
    );
  }
}
