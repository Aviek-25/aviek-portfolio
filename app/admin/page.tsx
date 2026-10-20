
import "server-only";

import { Suspense } from "react";
import { requireAdmin } from "@/lib/supabase/admins";
import { createClient } from "@/lib/supabase/server";
import AdminMessages, {
  type ContactMessage,
} from "./AdminMessages";

function AdminLoading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: "#f7f7f8",
        color: "#171717",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32 }}>Portfolio Admin</h1>
        <p style={{ marginTop: 12, color: "#737373" }}>
          Loading your secure dashboard...
        </p>
      </div>
    </main>
  );
}

async function AdminPageContent() {
  // Keep authentication and database access inside the Suspense boundary.
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      "id, name, email, subject, message, status, created_at"
    )
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as ContactMessage[];

  return (
    <AdminMessages
      adminEmail={admin.email}
      initialMessages={messages}
      loadError={error?.message ?? null}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminPageContent />
    </Suspense>
  );
}
