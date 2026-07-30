"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { useSettings } from "@/components/SettingsProvider";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  screenshots: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
}

const PER_PAGE = 6;

export default function ProjectsPage() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = settings.categories.length > 0
    ? ["all", ...settings.categories]
    : ["all"];

  useEffect(() => {
    loadProjects(activeCategory, 1);
  }, []);

  async function loadProjects(category: string, pageNum: number) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      params.set("page", String(pageNum));
      params.set("limit", String(PER_PAGE));

      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setTotalPages(data.totalPages || 1);
        setPage(data.page || 1);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    loadProjects(category, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    loadProjects(activeCategory, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="py-20 lg:py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[128px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Portfolio
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                All Projects
              </h1>
              <p className="text-text-secondary max-w-xl mx-auto">
                Browse through my complete collection of projects.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat === "all" ? "All Projects" : cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-surface-light/50 border border-white/5 overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="h-48 bg-surface-lighter/50" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-surface-lighter/50 rounded w-3/4" />
                      <div className="h-4 bg-surface-lighter/50 rounded w-full" />
                      <div className="h-4 bg-surface-lighter/50 rounded w-2/3" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-surface-lighter/50 rounded w-16" />
                        <div className="h-6 bg-surface-lighter/50 rounded w-20" />
                        <div className="h-6 bg-surface-lighter/50 rounded w-14" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-text-muted/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-text-muted">No projects in this category yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard key={project.id} {...project} index={index} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="p-2.5 rounded-xl border border-white/5 bg-surface-light/50 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                          page === pageNum
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "border border-white/5 bg-surface-light/50 text-text-secondary hover:text-text-primary hover:border-white/20"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="p-2.5 rounded-xl border border-white/5 bg-surface-light/50 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
