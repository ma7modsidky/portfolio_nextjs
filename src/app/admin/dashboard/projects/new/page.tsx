"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

export default function NewProject() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    category: "Web",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, []);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription,
        category: formData.category,
        techStack: formData.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        screenshots,
        githubUrl: formData.githubUrl || null,
        liveUrl: formData.liveUrl || null,
        featured: formData.featured,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard/projects");
      } else {
        setError(data.error || "Failed to create project");
      }
    } catch {
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/dashboard/projects"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
          <p className="text-text-muted mt-1">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/5 bg-surface-light/50 p-6 lg:p-8"
      >
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="My Awesome Project"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="my-awesome-project"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="A brief overview of the project..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                       placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                       transition-all duration-200 text-sm resize-none"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Long Description
          </label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows={5}
            placeholder="Detailed description of the project, technologies used, challenges faced..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                       placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                       transition-all duration-200 text-sm resize-none"
          />
        </div>

        {/* Category & Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm appearance-none disabled:opacity-50
                         bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22%3e%3cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M6 9l6 6 6-6%22/%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
            >
              {categories.length === 0 && <option value="Web">Web</option>}
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tech Stack
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm"
            />
            <p className="text-xs text-text-muted mt-1">
              Comma-separated list
            </p>
          </div>
        </div>

        <ImageUploader images={screenshots} onChange={setScreenshots} />

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://my-project.vercel.app"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary
                         placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-surface-lighter border border-white/10 peer-checked:bg-primary transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white peer-checked:translate-x-4 transition-transform duration-200 shadow" />
          </div>
          <span className="text-sm text-text-secondary">
            Mark as featured project
          </span>
        </label>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm border border-danger/20">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium
                       hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <Link
            href="/admin/dashboard/projects"
            className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-all text-sm font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
