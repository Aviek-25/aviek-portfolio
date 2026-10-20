"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowDownToLine,
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  ExternalLink,
  Inbox,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
};

type Props = {
  adminEmail: string;
  initialMessages: ContactMessage[];
  loadError: string | null;
};

type Filter = "all" | "new" | "read" | "replied" | "archived";
type MessageStatus = "new" | "read" | "replied" | "archived";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All messages", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
  { label: "Archived", value: "archived" },
];

const STATUS_STYLES: Record<string, string> = {
  new: "status-new",
  read: "status-read",
  replied: "status-replied",
  archived: "status-archived",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

function getStatus(message: ContactMessage): MessageStatus {
  const status = message.status ?? "new";

  if (
    status === "read" ||
    status === "replied" ||
    status === "archived"
  ) {
    return status;
  }

  return "new";
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

export default function AdminMessages({
  adminEmail,
  initialMessages,
  loadError,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(
    () => ({
      all: messages.length,
      new: messages.filter((m) => getStatus(m) === "new").length,
      read: messages.filter((m) => getStatus(m) === "read").length,
      replied: messages.filter((m) => getStatus(m) === "replied").length,
      archived: messages.filter((m) => getStatus(m) === "archived").length,
    }),
    [messages]
  );

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();

    return messages.filter((item) => {
      const status = getStatus(item);
      const matchesFilter = filter === "all" || status === filter;
      const searchableText = [
        item.name,
        item.email,
        item.subject,
        item.message,
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(q);
    });
  }, [messages, query, filter]);

  useEffect(() => {
    if (!selectedMessage) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedMessage(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMessage]);

  function showNotice(message: string) {
    setNotice(message);
    setActionError("");
  }

  function showError(message: string) {
    setActionError(message);
    setNotice("");
  }

  async function readJson(response: Response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  async function updateStatus(
    item: ContactMessage,
    status: MessageStatus
  ) {
    setBusyId(item.id);
    setNotice("");
    setActionError("");

    try {
      const response = await fetch(
        `/api/admin/messages?id=${encodeURIComponent(item.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update the message."
        );
      }

      const updatedMessage: ContactMessage = {
        ...item,
        ...(result.message ?? {}),
        status,
      };

      setMessages((previous) =>
        previous.map((message) =>
          message.id === item.id ? updatedMessage : message
        )
      );

      setSelectedMessage((previous) =>
        previous?.id === item.id ? updatedMessage : previous
      );

      showNotice(`Message marked ${STATUS_LABELS[status].toLowerCase()}.`);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Unable to update the message."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMessage(item: ContactMessage) {
    const confirmed = window.confirm(
      `Permanently delete the message from ${item.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(item.id);
    setNotice("");
    setActionError("");

    try {
      const response = await fetch(
        `/api/admin/messages?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to delete the message."
        );
      }

      setMessages((previous) =>
        previous.filter((message) => message.id !== item.id)
      );

      setSelectedMessage((previous) =>
        previous?.id === item.id ? null : previous
      );

      showNotice("Message deleted successfully.");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Unable to delete the message."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function refreshMessages() {
    setRefreshing(true);
    setNotice("");
    setActionError("");

    try {
      const response = await fetch("/api/admin/messages", {
        method: "GET",
        cache: "no-store",
      });

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(result.error || "Unable to refresh messages.");
      }

      const refreshed: ContactMessage[] = result.messages ?? [];
      setMessages(refreshed);

      setSelectedMessage((previous) =>
        previous
          ? refreshed.find((message) => message.id === previous.id) ?? null
          : null
      );

      showNotice("Inbox refreshed.");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Unable to refresh messages."
      );
    } finally {
      setRefreshing(false);
    }
  }

  function exportCsv() {
    if (!filteredMessages.length) {
      showError("There are no messages to export.");
      return;
    }

    const columns = [
      "Name",
      "Email",
      "Subject",
      "Message",
      "Status",
      "Received",
    ];

    const escapeCsv = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = filteredMessages.map((item) => [
      item.name,
      item.email,
      item.subject,
      item.message,
      getStatus(item),
      item.created_at,
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-enquiries.csv";
    link.click();
    URL.revokeObjectURL(url);

    showNotice(`${filteredMessages.length} messages exported.`);
  }

  function replyUrl(item: ContactMessage) {
    const subject = `Re: ${item.subject || "Your enquiry"}`;
    const body = `Hi ${item.name},\n\n\n\nRegards,\nAviek`;

    return `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="Return to portfolio">
            <span className="brand-mark">
              <Sparkles size={19} />
            </span>
            <span>
              <strong>aviek<span className="cyan-text">.dev</span></strong>
              <small>ADMIN CONSOLE</small>
            </span>
          </Link>

          <div className="topbar-right">
            <span className="secure-label">
              <ShieldCheck size={15} />
              Private workspace
            </span>
            <Link className="button button-secondary" href="/">
              <ExternalLink size={15} />
              <span className="button-label">View portfolio</span>
            </Link>
          </div>
        </header>

        <section className="welcome">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              YOUR WORKSPACE
            </div>
            <h1>
              Welcome back<span className="cyan-text">.</span>
            </h1>
            <p className="welcome-copy">
              Your portfolio enquiries, all in one place.
            </p>
            <div className="account-line">
              <span className="account-avatar">
                {initials(adminEmail.split("@")[0] || "A")}
              </span>
              <span>
                <strong>{adminEmail}</strong>
                <small>Authenticated administrator</small>
              </span>
            </div>
          </div>

          <div className="welcome-decoration" aria-hidden="true">
            <div className="decoration-ring ring-one" />
            <div className="decoration-ring ring-two" />
            <div className="decoration-core">
              <Inbox size={36} strokeWidth={1.3} />
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Message statistics">
          <article className="stat-card stat-primary">
            <div className="stat-top">
              <span>Total messages</span>
              <span className="stat-icon cyan-icon"><Inbox size={19} /></span>
            </div>
            <strong className="stat-number">{counts.all}</strong>
            <span className="stat-caption">All enquiries received</span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>New messages</span>
              <span className="stat-icon amber-icon"><Mail size={19} /></span>
            </div>
            <strong className="stat-number">{counts.new}</strong>
            <span className="stat-caption">Awaiting your attention</span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Read</span>
              <span className="stat-icon blue-icon"><Check size={19} /></span>
            </div>
            <strong className="stat-number">{counts.read}</strong>
            <span className="stat-caption">Messages reviewed</span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Replied</span>
              <span className="stat-icon green-icon"><CheckCheck size={19} /></span>
            </div>
            <strong className="stat-number">{counts.replied}</strong>
            <span className="stat-caption">Marked as replied</span>
          </article>
        </section>

        {(notice || actionError || loadError) && (
          <div
            className={`notice ${actionError || loadError ? "notice-error" : "notice-success"}`}
            role={actionError || loadError ? "alert" : "status"}
          >
            <span>
              {actionError || loadError || notice}
            </span>
            <button
              type="button"
              className="notice-close"
              onClick={() => {
                setNotice("");
                setActionError("");
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="inbox-panel">
          <div className="inbox-heading">
            <div>
              <div className="eyebrow">COMMUNICATIONS</div>
              <h2>
                Message inbox <span className="heading-count">{counts.all}</span>
              </h2>
              <p>Review, organize, and respond to incoming enquiries.</p>
            </div>

            <div className="heading-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={refreshMessages}
                disabled={refreshing}
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "spin" : ""}
                />
                <span>{refreshing ? "Refreshing" : "Refresh"}</span>
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={exportCsv}
              >
                <ArrowDownToLine size={15} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <Search size={17} />
              <input
                aria-label="Search messages"
                placeholder="Search messages, people, emails..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          <div className="filter-tabs" role="group" aria-label="Filter messages">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`filter-tab ${filter === item.value ? "filter-active" : ""}`}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
                <span className="filter-count">{counts[item.value]}</span>
              </button>
            ))}
          </div>

          <div className="results-line">
            <span>
              Showing <strong>{filteredMessages.length}</strong> of{" "}
              <strong>{messages.length}</strong> messages
            </span>
            {(query || filter !== "all") && (
              <button
                type="button"
                className="reset-filters"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredMessages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><MessageSquareText size={27} /></div>
              <h3>{messages.length ? "No matching messages" : "Your inbox is empty"}</h3>
              <p>
                {messages.length
                  ? "Try another search term or select a different status."
                  : "Messages submitted through your portfolio contact form will appear here."}
              </p>
              {(query || filter !== "all") && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="message-list">
              {filteredMessages.map((item, index) => {
                const status = getStatus(item);
                const busy = busyId === item.id;

                return (
                  <article
                    key={item.id}
                    className="message-card"
                    style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
                  >
                    <button
                      type="button"
                      className="message-main"
                      onClick={() => setSelectedMessage(item)}
                      aria-label={`Open message from ${item.name}: ${item.subject || "No subject"}`}
                    >
                      <span className="sender-avatar">{initials(item.name)}</span>

                      <span className="message-content">
                        <span className="message-title-row">
                          <strong className="message-subject">
                            {item.subject || "(No subject)"}
                          </strong>
                          <span className={`status-badge ${STATUS_STYLES[status]}`}>
                            <span className="status-dot" />
                            {STATUS_LABELS[status]}
                          </span>
                        </span>

                        <span className="message-sender">
                          {item.name}
                          <span className="message-separator">·</span>
                          {item.email}
                        </span>

                        <span className="message-preview">
                          {item.message}
                        </span>

                        <span className="message-time">
                          <Clock3 size={13} />
                          {formatDate(item.created_at)}
                        </span>
                      </span>

                      <span className="message-open-icon">
                        <ChevronRight size={19} />
                      </span>
                    </button>

                    <div className="message-actions">
                      <button
                        type="button"
                        className="icon-button"
                        title="Open message details"
                        aria-label="Open message details"
                        onClick={() => setSelectedMessage(item)}
                      >
                        <MessageSquareText size={15} />
                        <span>Details</span>
                      </button>

                      <a
                        href={replyUrl(item)}
                        className="icon-button"
                        title="Reply using your email application"
                      >
                        <Mail size={15} />
                        <span>Reply</span>
                      </a>

                      {status !== "read" && (
                        <button
                          type="button"
                          className="icon-button"
                          disabled={busy}
                          onClick={() => updateStatus(item, "read")}
                        >
                          <Check size={15} />
                          <span>Mark read</span>
                        </button>
                      )}

                      {status !== "replied" && (
                        <button
                          type="button"
                          className="icon-button"
                          disabled={busy}
                          onClick={() => updateStatus(item, "replied")}
                        >
                          <CheckCheck size={15} />
                          <span>Replied</span>
                        </button>
                      )}

                      {status !== "archived" && (
                        <button
                          type="button"
                          className="icon-button"
                          disabled={busy}
                          onClick={() => updateStatus(item, "archived")}
                        >
                          <Archive size={15} />
                          <span>Archive</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="icon-button icon-danger"
                        disabled={busy}
                        onClick={() => deleteMessage(item)}
                      >
                        <Trash2 size={15} />
                        <span>{busy ? "Working…" : "Delete"}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="admin-footer">
          <span>AVIEK.DEV <span className="footer-separator">/</span> ADMIN</span>
          <span><ShieldCheck size={13} /> Authenticated session</span>
        </footer>
      </div>

      {selectedMessage && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <section
            className="message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
          >
            <header className="modal-header">
              <div className="modal-heading-icon">
                <MessageSquareText size={20} />
              </div>
              <div className="modal-heading-text">
                <span className="eyebrow">MESSAGE DETAILS</span>
                <h2 id="message-modal-title">Enquiry</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
              >
                <X size={19} />
              </button>
            </header>

            <div className="modal-body">
              <div className="modal-subject-row">
                <h3>{selectedMessage.subject || "(No subject)"}</h3>
                <span
                  className={`status-badge ${STATUS_STYLES[getStatus(selectedMessage)]}`}
                >
                  <span className="status-dot" />
                  {STATUS_LABELS[getStatus(selectedMessage)]}
                </span>
              </div>

              <div className="sender-detail">
                <span className="sender-avatar sender-avatar-large">
                  {initials(selectedMessage.name)}
                </span>
                <div>
                  <strong>{selectedMessage.name}</strong>
                  <a href={`mailto:${selectedMessage.email}`}>
                    {selectedMessage.email}
                  </a>
                  <small>Received {formatDate(selectedMessage.created_at)}</small>
                </div>
              </div>

              <div className="message-body-box">
                <span className="eyebrow">MESSAGE</span>
                <p>{selectedMessage.message}</p>
              </div>

              <div className="modal-actions">
                <a
                  href={replyUrl(selectedMessage)}
                  className="button button-primary"
                >
                  <Mail size={16} /> Reply by email
                </a>

                {getStatus(selectedMessage) !== "read" && (
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => updateStatus(selectedMessage, "read")}
                  >
                    <Check size={16} /> Mark read
                  </button>
                )}

                {getStatus(selectedMessage) !== "replied" && (
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => updateStatus(selectedMessage, "replied")}
                  >
                    <CheckCheck size={16} /> Mark replied
                  </button>
                )}

                {getStatus(selectedMessage) !== "archived" && (
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => updateStatus(selectedMessage, "archived")}
                  >
                    <Archive size={16} /> Archive
                  </button>
                )}

                <button
                  type="button"
                  className="button button-danger"
                  disabled={busyId === selectedMessage.id}
                  onClick={() => deleteMessage(selectedMessage)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setSelectedMessage(null)}
              >
                <ArrowLeft size={15} /> Back to inbox
              </button>
              <span>Message ID: {selectedMessage.id.slice(0, 8)}…</span>
            </footer>
          </section>
        </div>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #090d14;
        }

        .admin-shell {
          min-height: 100vh;
          padding: 0 24px 32px;
          background:
            radial-gradient(ellipse at 50% -18%, rgba(34, 211, 238, .10), transparent 48%),
            #090d14;
          color: #e8edf5;
          font-family: Arial, Helvetica, sans-serif;
        }

        .admin-container {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
        }

        .topbar {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #202937;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #f3f7fc;
          text-decoration: none;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(34, 211, 238, .34);
          border-radius: 12px;
          background: rgba(34, 211, 238, .09);
          color: #67e8f9;
        }

        .brand strong {
          display: block;
          font-size: 18px;
          letter-spacing: -.5px;
        }

        .brand small {
          display: block;
          margin-top: 4px;
          color: #7e8a9c;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.6px;
        }

        .cyan-text { color: #67e8f9; }

        .topbar-right, .secure-label {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .secure-label {
          gap: 7px;
          color: #9ba8b9;
          font-size: 12px;
        }

        .secure-label :global(svg) { color: #67e8f9; }

        .button {
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid transparent;
          border-radius: 9px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          text-decoration: none;
          cursor: pointer;
          transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
        }

        .button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .button-secondary {
          color: #d4dce8;
          border-color: #303b4b;
          background: #141b26;
        }

        .button-secondary:hover:not(:disabled) {
          border-color: #526276;
          background: #1a2533;
        }

        .button-primary {
          color: #061117;
          background: #67e8f9;
          border-color: #67e8f9;
          box-shadow: 0 0 20px rgba(34, 211, 238, .07);
        }

        .button-primary:hover:not(:disabled) {
          background: #a5f3fc;
          box-shadow: 0 0 24px rgba(34, 211, 238, .16);
        }

        .button-danger {
          color: #fda4af;
          background: rgba(244, 63, 94, .08);
          border-color: rgba(244, 63, 94, .28);
        }

        .button-danger:hover:not(:disabled) {
          background: rgba(244, 63, 94, .16);
        }

        .welcome {
          min-height: 220px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
          padding: 34px 0 28px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8291a5;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 1.7px;
        }

        .live-dot, .status-dot {
          width: 7px;
          height: 7px;
          display: inline-block;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #67e8f9;
        }

        .live-dot { box-shadow: 0 0 10px rgba(103, 232, 249, .7); }

        .welcome h1 {
          margin: 15px 0 8px;
          font-size: clamp(30px, 4vw, 43px);
          font-weight: 750;
          letter-spacing: -1.8px;
        }

        .welcome-copy {
          margin: 0;
          color: #97a4b5;
          font-size: 14px;
          line-height: 1.7;
        }

        .account-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }

        .account-avatar, .sender-avatar {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid #334252;
          border-radius: 12px;
          background: #182331;
          color: #a5f3fc;
          font-size: 12px;
          font-weight: 750;
        }

        .account-avatar { width: 36px; height: 36px; }

        .account-line strong, .account-line small {
          display: block;
          overflow-wrap: anywhere;
        }

        .account-line strong { font-size: 12px; font-weight: 600; }
        .account-line small { margin-top: 4px; color: #77869a; font-size: 11px; }

        .welcome-decoration {
          position: relative;
          width: 180px;
          height: 160px;
          flex: 0 0 auto;
          margin-right: 45px;
        }

        .decoration-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(103, 232, 249, .13);
          border-radius: 50%;
          animation: orbit 18s linear infinite;
        }

        .ring-one { transform: rotateX(62deg) rotateZ(-25deg); }
        .ring-two {
          inset: 15px -18px;
          transform: rotateX(62deg) rotateZ(45deg);
          animation-direction: reverse;
        }

        .decoration-core {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #67e8f9;
          filter: drop-shadow(0 0 20px rgba(34, 211, 238, .28));
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }

        .stat-card {
          min-width: 0;
          padding: 19px;
          border: 1px solid #252f3e;
          border-radius: 14px;
          background: linear-gradient(145deg, #151c27, #101620);
          transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
          animation: fade-up .45s ease both;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: #3b5263;
          box-shadow: 0 10px 28px rgba(0, 0, 0, .15);
        }

        .stat-primary {
          border-color: rgba(34, 211, 238, .3);
          background: linear-gradient(145deg, rgba(34, 211, 238, .09), #111822 75%);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #a2afbf;
          font-size: 12px;
        }

        .stat-icon {
          width: 35px;
          height: 35px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 10px;
          background: #202b39;
        }

        .cyan-icon { color: #67e8f9; background: rgba(34, 211, 238, .1); }
        .amber-icon { color: #fbbf24; }
        .blue-icon { color: #93c5fd; }
        .green-icon { color: #86efac; }

        .stat-number {
          display: block;
          margin-top: 18px;
          color: #f4f7fb;
          font-size: 34px;
          font-weight: 750;
          letter-spacing: -1px;
          font-variant-numeric: tabular-nums;
        }

        .stat-caption {
          display: block;
          margin-top: 5px;
          color: #758398;
          font-size: 11px;
        }

        .notice {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin: 0 0 18px;
          padding: 13px 15px;
          border: 1px solid;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
          animation: fade-up .2s ease both;
        }

        .notice-success {
          color: #a7f3d0;
          background: rgba(16, 185, 129, .08);
          border-color: rgba(16, 185, 129, .22);
        }

        .notice-error {
          color: #fda4af;
          background: rgba(244, 63, 94, .08);
          border-color: rgba(244, 63, 94, .25);
        }

        .notice-close, .modal-close, .clear-search {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          padding: 4px;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .inbox-panel {
          overflow: hidden;
          border: 1px solid #252f3e;
          border-radius: 16px;
          background: #101620;
          box-shadow: 0 15px 55px rgba(0, 0, 0, .12);
        }

        .inbox-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px;
          border-bottom: 1px solid #252f3e;
        }

        .inbox-heading h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0 7px;
          font-size: 22px;
          letter-spacing: -.5px;
        }

        .inbox-heading p {
          margin: 0;
          color: #8795a8;
          font-size: 12px;
          line-height: 1.6;
        }

        .heading-count {
          display: inline-grid;
          min-width: 25px;
          height: 25px;
          place-items: center;
          padding: 0 6px;
          border: 1px solid #334252;
          border-radius: 8px;
          background: #1b2633;
          color: #b6c5d5;
          font-size: 11px;
          letter-spacing: 0;
        }

        .heading-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .toolbar { padding: 20px 24px 14px; }

        .search-box {
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 13px;
          border: 1px solid #2a3544;
          border-radius: 10px;
          background: #0b111a;
          color: #718096;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .search-box:focus-within {
          border-color: rgba(103, 232, 249, .6);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, .07);
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          padding: 12px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #e8edf5;
          font: inherit;
          font-size: 12px;
        }

        .search-box input::placeholder { color: #657388; }

        .filter-tabs {
          display: flex;
          gap: 5px;
          overflow-x: auto;
          padding: 0 24px 14px;
          border-bottom: 1px solid #252f3e;
          scrollbar-width: thin;
        }

        .filter-tab {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid transparent;
          border-radius: 9px;
          background: transparent;
          color: #9ba8b9;
          font: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: background .18s ease, color .18s ease, border-color .18s ease;
        }

        .filter-tab:hover {
          color: #e8edf5;
          background: #192330;
        }

        .filter-active {
          border-color: rgba(103, 232, 249, .24);
          background: rgba(34, 211, 238, .09);
          color: #a5f3fc;
        }

        .filter-count {
          min-width: 20px;
          padding: 3px 5px;
          border-radius: 6px;
          background: rgba(127, 145, 166, .13);
          color: inherit;
          font-size: 10px;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .results-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 15px 24px 10px;
          color: #8391a4;
          font-size: 11px;
        }

        .results-line strong { color: #d8e1ed; }

        .reset-filters {
          border: 0;
          background: transparent;
          color: #67e8f9;
          font: inherit;
          cursor: pointer;
        }

        .message-list {
          display: grid;
          gap: 10px;
          padding: 10px 18px 22px;
        }

        .message-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #273241;
          border-radius: 12px;
          background: #141c27;
          animation: fade-up .35s ease both;
          transition: border-color .2s ease, background .2s ease, transform .2s ease;
        }

        .message-card:hover {
          border-color: #405264;
          background: #17212d;
          transform: translateY(-1px);
        }

        .message-main {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 17px 17px 14px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .sender-avatar {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          background: linear-gradient(145deg, #203342, #17212d);
          font-size: 13px;
        }

        .message-content {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .message-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }

        .message-subject {
          color: #e7edf6;
          font-size: 13px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .status-badge {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border: 1px solid;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 650;
        }

        .status-badge .status-dot {
          width: 5px;
          height: 5px;
          background: currentColor;
          box-shadow: none;
        }

        .status-new {
          border-color: rgba(251, 191, 36, .2);
          background: rgba(251, 191, 36, .08);
          color: #fcd34d;
        }

        .status-read {
          border-color: rgba(147, 197, 253, .2);
          background: rgba(147, 197, 253, .08);
          color: #93c5fd;
        }

        .status-replied {
          border-color: rgba(134, 239, 172, .2);
          background: rgba(134, 239, 172, .08);
          color: #86efac;
        }

        .status-archived {
          border-color: rgba(203, 213, 225, .2);
          background: rgba(203, 213, 225, .07);
          color: #cbd5e1;
        }

        .message-sender {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          color: #9eacbd;
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .message-separator { color: #566477; }

        .message-preview {
          display: -webkit-box;
          overflow: hidden;
          color: #8492a5;
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .message-time {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
          color: #718096;
          font-size: 10px;
        }

        .message-open-icon {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          margin-top: 8px;
          color: #58677a;
          transition: color .18s ease, transform .18s ease;
        }

        .message-card:hover .message-open-icon {
          color: #67e8f9;
          transform: translateX(2px);
        }

        .message-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 5px;
          padding: 10px 16px;
          border-top: 1px solid #25303e;
          background: rgba(8, 13, 21, .18);
        }

        .icon-button {
          min-height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 8px;
          border: 1px solid transparent;
          border-radius: 7px;
          background: transparent;
          color: #9aa8ba;
          font: inherit;
          font-size: 10px;
          text-decoration: none;
          cursor: pointer;
          transition: background .16s ease, color .16s ease, border-color .16s ease;
        }

        .icon-button:hover:not(:disabled) {
          border-color: #354558;
          background: #202b39;
          color: #e5edf7;
        }

        .icon-button:disabled { opacity: .45; cursor: not-allowed; }

        .icon-danger { margin-left: auto; color: #fb8d9c; }
        .icon-danger:hover:not(:disabled) {
          border-color: rgba(244, 63, 94, .25);
          background: rgba(244, 63, 94, .09);
          color: #fda4af;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 58px 24px;
          text-align: center;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid #304050;
          border-radius: 17px;
          background: #192330;
          color: #67e8f9;
        }

        .empty-state h3 { margin: 18px 0 8px; font-size: 16px; }
        .empty-state p {
          max-width: 390px;
          margin: 0 0 18px;
          color: #8391a4;
          font-size: 12px;
          line-height: 1.8;
        }

        .admin-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 23px 2px 0;
          color: #627084;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.3px;
        }

        .footer-separator { padding: 0 5px; color: #344456; }

        .admin-footer > span:last-child {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .admin-footer :global(svg) { color: #67e8f9; }

        .modal-backdrop {
          position: fixed;
          z-index: 100;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 24px;
          background: rgba(2, 5, 10, .78);
          backdrop-filter: blur(8px);
          animation: backdrop-in .18s ease both;
        }

        .message-modal {
          width: 100%;
          max-width: 650px;
          max-height: min(85vh, 850px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #344354;
          border-radius: 17px;
          background: #111923;
          box-shadow: 0 28px 100px rgba(0, 0, 0, .5);
          animation: modal-in .22s ease both;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 19px 22px;
          border-bottom: 1px solid #283442;
        }

        .modal-heading-icon {
          width: 40px;
          height: 40px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(103, 232, 249, .25);
          border-radius: 12px;
          background: rgba(34, 211, 238, .08);
          color: #67e8f9;
        }

        .modal-heading-text { min-width: 0; flex: 1; }
        .modal-heading-text h2 { margin: 5px 0 0; font-size: 17px; }
        .modal-close {
          width: 34px;
          height: 34px;
          border: 1px solid #303d4c;
          border-radius: 9px;
          color: #aab6c5;
        }

        .modal-close:hover { background: #202b39; color: #fff; }

        .modal-body {
          overflow-y: auto;
          padding: 22px;
        }

        .modal-subject-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .modal-subject-row h3 {
          margin: 0;
          color: #eef4fb;
          font-size: 19px;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .sender-detail {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 1px solid #293646;
          border-radius: 12px;
          background: #151f2b;
        }

        .sender-avatar-large { width: 47px; height: 47px; }

        .sender-detail > div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sender-detail strong {
          color: #e8edf5;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .sender-detail a {
          color: #67e8f9;
          font-size: 12px;
          overflow-wrap: anywhere;
          text-decoration: none;
        }

        .sender-detail a:hover { text-decoration: underline; }
        .sender-detail small { color: #8492a5; font-size: 10px; }

        .message-body-box {
          margin-top: 18px;
          padding: 18px;
          border: 1px solid #293646;
          border-radius: 12px;
          background: #0b111a;
        }

        .message-body-box p {
          margin: 13px 0 0;
          color: #d0d9e6;
          font-size: 13px;
          line-height: 1.9;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 22px;
          border-top: 1px solid #283442;
          background: #0d141e;
        }

        .modal-footer > span {
          color: #718096;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .spin { animation: spin .9s linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes modal-in {
          from { opacity: 0; transform: translateY(10px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes orbit {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 850px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .welcome-decoration { margin-right: 10px; }
          .inbox-heading { align-items: flex-start; flex-direction: column; }
          .heading-actions { width: 100%; }
        }

        @media (max-width: 560px) {
          .admin-shell { padding: 0 12px 24px; }
          .topbar { min-height: 70px; gap: 8px; }
          .topbar-right { gap: 8px; }
          .secure-label { display: none; }
          .button { min-height: 37px; padding: 8px 10px; font-size: 11px; }
          .button-label { display: none; }
          .welcome { min-height: 0; padding: 30px 0 25px; }
          .welcome h1 { font-size: 31px; letter-spacing: -1.1px; }
          .welcome-copy { max-width: 260px; font-size: 12px; }
          .welcome-decoration { position: absolute; right: -75px; opacity: .45; transform: scale(.75); }
          .account-line { max-width: 85%; }
          .account-line strong { font-size: 10px; }
          .stats-grid { gap: 9px; margin-bottom: 20px; }
          .stat-card { padding: 13px; border-radius: 12px; }
          .stat-top { align-items: flex-start; font-size: 10px; }
          .stat-icon { width: 29px; height: 29px; border-radius: 8px; }
          .stat-icon :global(svg) { width: 16px; height: 16px; }
          .stat-number { margin-top: 13px; font-size: 28px; }
          .stat-caption { font-size: 9px; line-height: 1.5; }
          .inbox-panel { border-radius: 12px; }
          .inbox-heading { gap: 15px; padding: 17px; }
          .inbox-heading h2 { font-size: 19px; }
          .inbox-heading p { font-size: 11px; }
          .heading-actions { gap: 7px; }
          .toolbar { padding: 15px 14px 12px; }
          .filter-tabs { padding: 0 14px 12px; }
          .filter-tab { padding: 9px 10px; font-size: 11px; }
          .results-line { padding: 13px 15px 9px; font-size: 10px; }
          .message-list { gap: 9px; padding: 8px 9px 14px; }
          .message-main { gap: 10px; padding: 13px 11px 12px; }
          .sender-avatar { width: 34px; height: 34px; border-radius: 10px; font-size: 11px; }
          .message-title-row { gap: 6px; }
          .message-subject { font-size: 12px; }
          .status-badge { padding: 4px 6px; font-size: 9px; }
          .message-sender { gap: 5px; font-size: 10px; }
          .message-preview { font-size: 11px; }
          .message-actions { gap: 3px; padding: 8px; }
          .icon-button { min-height: 30px; padding: 6px; font-size: 10px; }
          .icon-button :global(svg) { width: 13px; height: 13px; }
          .admin-footer { align-items: flex-start; flex-direction: column; }
          .modal-backdrop { align-items: flex-end; padding: 8px; }
          .message-modal { max-height: 91vh; border-radius: 15px; }
          .modal-header, .modal-body { padding: 16px; }
          .modal-subject-row { flex-direction: column; }
          .modal-subject-row h3 { font-size: 17px; }
          .message-body-box { padding: 14px; }
          .modal-actions { gap: 7px; }
          .modal-actions .button { flex: 1 1 auto; }
          .modal-footer { padding: 12px 16px; }
          .modal-footer > span { max-width: 115px; text-align: right; }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-shell *, .admin-shell *::before, .admin-shell *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
