"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: string, currentRead: boolean) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, read: !currentRead } : m
          )
        );
        if (selected?.id === id) {
          setSelected((prev) =>
            prev ? { ...prev, read: !currentRead } : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(id: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    } finally {
      setUpdating(false);
      setDeleteConfirm(null);
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Messages List */}
      <div className="lg:w-96 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <p className="text-text-muted mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "All messages read"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface-light/50 overflow-hidden h-[calc(100%-5rem)]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 text-text-muted/30 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-text-muted">No messages yet</p>
            </div>
          ) : (
            <div className="overflow-y-auto h-full divide-y divide-white/5">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={`w-full text-left p-4 transition-colors hover:bg-white/[0.02] ${
                    selected?.id === msg.id
                      ? "bg-primary/5 border-l-2 border-primary"
                      : "border-l-2 border-transparent"
                  } ${!msg.read ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className={`text-sm font-medium truncate ${
                        !msg.read
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${
                      !msg.read ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {msg.subject}
                  </p>
                  {!msg.read && (
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1">
        {selected ? (
          <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {selected.subject}
                </h2>
                <p className="text-text-muted mt-1">
                  From{" "}
                  <span className="text-text-primary">{selected.name}</span> (
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-primary hover:text-primary-light transition-colors"
                  >
                    {selected.email}
                  </a>
                  )
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(selected.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRead(selected.id, selected.read)}
                  disabled={updating}
                  className={`p-2 rounded-lg transition-all text-sm ${
                    selected.read
                      ? "text-text-muted hover:text-text-primary hover:bg-white/5"
                      : "text-primary bg-primary/10 hover:bg-primary/20"
                  }`}
                  title={selected.read ? "Mark as unread" : "Mark as read"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteConfirm(selected.id)}
                  className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
                  title="Delete message"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 rounded-xl bg-surface-lighter/30 border border-white/5">
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark
                           text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-12 h-full flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-text-muted/20 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-text-muted">
                Select a message to read
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-light rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
              Delete Message
            </h3>
            <p className="text-text-muted text-sm text-center mb-6">
              Are you sure you want to delete this message?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white hover:bg-danger/90 transition-all text-sm font-medium disabled:opacity-50"
              >
                {updating ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
