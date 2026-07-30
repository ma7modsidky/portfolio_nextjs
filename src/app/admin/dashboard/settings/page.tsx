"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings-api";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    jobTitle: "",
    bio: "",
    email: "",
    phone: "",
    githubUrl: "",
    linkedInUrl: "",
    heroTagline: "",
    heroHighlight: "",
    experienceStartYear: 2020,
    avatar: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data: SiteSettings = await res.json();
          setFormData({
            siteName: data.siteName,
            jobTitle: data.jobTitle,
            bio: data.bio,
            email: data.email,
            phone: data.phone,
            githubUrl: data.githubUrl,
            linkedInUrl: data.linkedInUrl,
            heroTagline: data.heroTagline,
            heroHighlight: data.heroHighlight,
            experienceStartYear: data.experienceStartYear,
            avatar: data.avatar,
          });
          setCategories(data.categories);
        }
      } catch {
        setError("Failed to load settings");
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const body = {
        ...formData,
        experienceStartYear: Number(formData.experienceStartYear),
        categories,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess("Settings saved successfully");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
      }
    } catch {
      setError("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.urls?.length) {
        setFormData((prev) => ({ ...prev, avatar: data.urls[0] }));
      }
    } catch {
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const updateCategory = (i: number, value: string) => {
    const updated = [...categories];
    updated[i] = value;
    setCategories(updated);
  };

  const removeCategory = (i: number) => {
    setCategories(categories.filter((_, idx) => idx !== i));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm";

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/dashboard"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Site Settings</h1>
          <p className="text-text-muted mt-1">Manage your portfolio information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Info */}
        <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8 space-y-5">
          <h2 className="text-lg font-semibold text-text-primary">Profile</h2>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-surface-lighter/50 border border-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                  className="text-sm text-danger hover:text-danger/80 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Site Name</label>
              <input name="siteName" value={formData.siteName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Job Title</label>
              <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={inputClass + " resize-none"} />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8 space-y-5">
          <h2 className="text-lg font-semibold text-text-primary">Contact Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">GitHub URL</label>
              <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">LinkedIn URL</label>
              <input name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8 space-y-5">
          <h2 className="text-lg font-semibold text-text-primary">Hero Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tagline</label>
              <input name="heroTagline" value={formData.heroTagline} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Highlight Word</label>
              <input name="heroHighlight" value={formData.heroHighlight} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Experience Start Year</label>
            <input name="experienceStartYear" type="number" value={formData.experienceStartYear} onChange={handleChange} className={inputClass + " sm:max-w-40"} />
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Project Categories</h2>
            <button type="button" onClick={addCategory} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
              + Add Category
            </button>
          </div>
          {categories.length === 0 && (
            <p className="text-sm text-text-muted">No categories added yet.</p>
          )}
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={cat}
                onChange={(e) => updateCategory(i, e.target.value)}
                placeholder="e.g. Web, Mobile, AI"
                className={inputClass + " flex-1"}
              />
              <button type="button" onClick={() => removeCategory(i)} className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-all flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm border border-danger/20">{error}</div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-xl bg-green-500/10 text-green-500 text-sm border border-green-500/20">{success}</div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
          <Link
            href="/admin/dashboard"
            className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-all text-sm font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
