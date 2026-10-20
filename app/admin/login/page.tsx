
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      // Step 1: Authenticate with Supabase.
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        console.error("Supabase sign-in failed:", signInError.message);
        setError("Unable to sign in. Check your email and password.");
        return;
      }

      console.log("Login succeeded; checking admin authorization...");

      // Step 2: Ask the server to verify the authenticated account.
      const response = await fetch("/api/admin/check", {
        method: "GET",
        cache: "no-store",
      });

      console.log("Admin check status:", response.status);

      if (!response.ok) {
        // Do not leave an unauthorized account signed in.
        await supabase.auth.signOut();

        if (response.status === 401 || response.status === 403) {
          setError(
            "This account is not authorized to access the dashboard."
          );
        } else {
          setError(
            "The server could not verify admin access. Please try again."
          );
        }

        return;
      }

      // Step 3: Navigate only after server authorization succeeds.
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error(
        "Admin login request failed:",
        err instanceof Error ? err.message : "Unknown error"
      );

      setError("Unable to complete sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-login-card">
        <h1>Admin sign in</h1>
        <p>Sign in to manage your portfolio enquiries.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
