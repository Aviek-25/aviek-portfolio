
import "server-only";

import { requireAdmin } from "@/lib/supabase/admins";
import { createClient } from "@/lib/supabase/server";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
};



export default async function AdminPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const {
    data: messages,
    error,
  } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: "#f7f7f8",
        color: "#171717",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>
              Portfolio Admin
            </h1>
            <p style={{ color: "#666" }}>
              Signed in as {admin.email}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href="/admin"
              style={{
                color: "#171717",
                border: "1px solid #d4d4d4",
                padding: "10px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Refresh enquiries
            </a>

            <a
              href="/"
              style={{
                color: "#171717",
                border: "1px solid #d4d4d4",
                padding: "10px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              View portfolio
            </a>
          </div>
        </header>

        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22 }}>Contact enquiries</h2>

          {error ? (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: 10,
              }}
            >
              <h3>Unable to load enquiries</h3>
              <p style={{ marginTop: 8 }}>
                Supabase returned this error:
              </p>
              <pre
                style={{
                  marginTop: 8,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {error.message}
              </pre>
              <p style={{ marginTop: 8 }}>
                Check the table name, column names, and the
                SELECT permissions for the authenticated admin.
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: "#666", marginTop: 8 }}>
                {messages?.length ?? 0} message(s) received
              </p>

              {!messages?.length ? (
                <div
                  style={{
                    marginTop: 20,
                    padding: 28,
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                  }}
                >
                  <h3>No enquiries returned</h3>
                  <p style={{ color: "#666", marginTop: 8 }}>
                    The query returned zero rows. If Supabase
                    Table Editor shows messages, check the
                    table's SELECT permissions and RLS policies.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    marginTop: 20,
                  }}
                >
                  {messages.map((item: ContactMessage) => (
                    <article
                      key={item.id}
                      style={{
                        padding: 22,
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        overflowWrap: "anywhere",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <h3 style={{ fontSize: 19 }}>
                          {item.subject}
                        </h3>
                        <span
                          style={{
                            padding: "4px 10px",
                            background: "#f3f4f6",
                            borderRadius: 20,
                            fontSize: 13,
                          }}
                        >
                          {item.status || "new"}
                        </span>
                      </div>

                      <p style={{ marginTop: 12 }}>
                        <strong>Name:</strong> {item.name}
                      </p>
                      <p style={{ marginTop: 6 }}>
                        <strong>Email:</strong>{" "}
                        <a href={`mailto:${item.email}`}>
                          {item.email}
                        </a>
                      </p>

                      <div
                        style={{
                          marginTop: 16,
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.message}
                      </div>

                      <p
                        style={{
                          marginTop: 18,
                          color: "#737373",
                          fontSize: 13,
                        }}
                      >
                        Received:{" "}
                        {new Date(item.created_at).toLocaleString("en-IN")}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
