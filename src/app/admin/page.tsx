"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        const redirect = searchParams.get("redirect") || "/admin/dashboard";
        router.push(redirect);
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                     placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                     transition-all duration-200"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm border border-danger/20">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium
                   hover:from-primary-dark hover:to-primary transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
                   active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Authenticating...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="text-center">
        <a
          href="/"
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          ← Back to portfolio
        </a>
      </div>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-lg shadow-primary/20">
            P
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
          <p className="text-text-muted mt-1">
            Enter your password to continue
          </p>
        </div>

        <Suspense
          fallback={
            <div className="glass rounded-2xl p-8 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
