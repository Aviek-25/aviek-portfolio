
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { createClient } from "@supabase/supabase-js";



const redis = Redis.fromEnv();

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "portfolio-contact",
  analytics: true,
});

export async function POST(request: Request) {
  // 1. Reject excessively large requests.
  const contentLength = Number(
    request.headers.get("content-length") ?? 0
  );

  if (contentLength > 10_000) {
    return Response.json(
      { error: "Request is too large." },
      { status: 413 }
    );
  }

  // 2. Apply rate limiting.
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  try {
    const { success, reset } = await rateLimit.limit(ip);

    if (!success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );

      return Response.json(
        { error: "Too many messages. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }
  } catch (error) {
    console.error("Rate limit service error:", error);

    return Response.json(
      { error: "Contact service is temporarily unavailable." },
      { status: 503 }
    );
  }

  // 3. Verify server-side environment variables.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;

  if (
    !supabaseUrl ||
    !supabaseSecretKey ||
    !resendApiKey ||
    !recipient
  ) {
    console.error("A required server environment variable is missing.");

    return Response.json(
      { error: "Contact service is not configured." },
      { status: 500 }
    );
  }

  // 4. Validate the request body.
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const name =
    typeof data.name === "string" ? data.name.trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim() : "";
  const subject =
    typeof data.subject === "string" ? data.subject.trim() : "";
  const message =
    typeof data.message === "string" ? data.message.trim() : "";

  if (
    !name ||
    !email ||
    !subject ||
    !message ||
    name.length > 100 ||
    email.length > 254 ||
    subject.length > 150 ||
    message.length > 5000
  ) {
    return Response.json(
      { error: "Please complete all fields correctly." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // 5. Initialize Supabase on the server only.
  const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  // 6. Save the enquiry before sending the notification email.
  let savedMessageId: string;

  try {
    const { data: savedMessage, error: databaseError } =
      await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          subject,
          message,
          status: "new",
        })
        .select("id")
        .single();

    if (databaseError || !savedMessage) {
      console.error(
        "Contact database insert failed:",
        databaseError?.message
      );

      return Response.json(
        {
          error:
            "Your message could not be saved. Please try again later.",
        },
        { status: 500 }
      );
    }

    savedMessageId = savedMessage.id;
  } catch (error) {
    console.error("Contact database error:", error);

    return Response.json(
      { error: "Unable to save your message right now." },
      { status: 500 }
    );
  }

  // 7. Send the email notification.
  try {
    const resend = new Resend(resendApiKey);

    const { error: emailError } = await resend.emails.send({
      from: "Aviek Portfolio <onboarding@resend.dev>",
      to: [recipient],
      replyTo: email,
      subject: `Portfolio enquiry: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        `Database ID: ${savedMessageId}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (emailError) {
      console.error(
        "Email notification failed:",
        emailError.message
      );

      // The message is already safely saved in the database.
      return Response.json(
        {
          success: true,
          saved: true,
          emailSent: false,
          message:
            "Your message was received and saved, but the email notification could not be sent.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Email notification error:", error);

    return Response.json(
      {
        success: true,
        saved: true,
        emailSent: false,
        message:
          "Your message was received and saved, but the email notification could not be sent.",
      },
      { status: 200 }
    );
  }

  // 8. Return success.
  return Response.json(
    {
      success: true,
      saved: true,
      emailSent: true,
      message: "Your message has been sent!",
    },
    { status: 200 }
  );
}
