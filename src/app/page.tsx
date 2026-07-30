"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
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

export default function Home() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = settings.categories.length > 0
    ? ["all", ...settings.categories]
    : ["all"];

  useEffect(() => {
    loadProjects("all");
  }, []);

  async function loadProjects(category: string) {
    setLoading(true);
    try {
      const url =
        category === "all"
          ? "/api/projects"
          : `/api/projects?category=${category}`;
      const res = await fetch(url);
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    loadProjects(category);
  };

  const heroParts = settings.heroTagline.split(
    new RegExp(`(${settings.heroHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i")
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 min-h-screen flex flex-col items-center justify-center">
            <div className="animate-fade-in w-full">
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                {settings.avatar && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-primary via-secondary to-accent opacity-40 blur-xl" />
                      <div className="absolute -inset-1 rounded-[28px] bg-surface/80 backdrop-blur-sm" />
                      <img
                        src={settings.avatar}
                        alt={settings.siteName}
                        className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-[24px] object-cover border-2 border-white/10 shadow-2xl"
                      />
                    </div>
                  </div>
                )}

                <div className={`text-center lg:text-left ${settings.avatar ? "" : "mx-auto"}`}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {settings.jobTitle}
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
                    {heroParts.length > 1 ? (
                      heroParts.map((part, i) =>
                        part.toLowerCase() === settings.heroHighlight.toLowerCase() ? (
                          <span key={i} className="gradient-text">{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )
                    ) : (
                      settings.heroTagline
                    )}
                  </h1>

                  <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed mb-8">
                    {settings.bio}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center lg:justify-start gap-3">
                    <a
                      href="#projects"
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium text-sm
                                 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]"
                    >
                      View Projects
                    </a>
                    <a
                      href="#contact"
                      className="px-7 py-3 rounded-xl border border-white/10 text-text-primary font-medium text-sm
                                 hover:bg-white/5 hover:border-white/20 transition-all duration-300 active:scale-[0.98]
                                 backdrop-blur-sm"
                    >
                      Get In Touch
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold gradient-text">{projects.length}</p>
                  <p className="text-sm text-text-muted mt-1">Projects</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold gradient-text">
                    {new Set(projects.map((p) => p.category)).size}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Categories</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold gradient-text">
                    {new Date().getFullYear() - settings.experienceStartYear}+
                  </p>
                  <p className="text-sm text-text-muted mt-1">Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Featured Projects
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                A collection of projects I&apos;ve worked on, ranging from web apps
                to AI-powered solutions.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} {...project} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        {settings.skills.length > 0 && (
          <section id="skills" className="py-20 lg:py-32 relative">
            <div className="absolute inset-0">
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-4">
                  Expertise
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                  Skills & Technologies
                </h2>
                <p className="text-text-secondary max-w-xl mx-auto">
                  Technologies I work with on a daily basis to build amazing products.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {settings.skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="group relative rounded-2xl border border-white/5 bg-surface-light/50 p-5 text-center
                               hover:border-primary/30 hover:bg-surface-light/80 transition-all duration-500"
                    style={{
                      animation: `slideUp 0.5s ease-out ${i * 0.05}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </span>
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                Contact
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Get In Touch
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Have a project in mind or just want to say hi? Drop me a message
                and I&apos;ll get back to you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-3 glass rounded-2xl p-6 sm:p-8">
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-4">
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-surface-light/50 hover:border-primary/30 hover:bg-surface-light/80 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Email</p>
                      <p className="text-sm text-text-primary group-hover:text-primary-light transition-colors">{settings.email}</p>
                    </div>
                  </a>
                )}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-surface-light/50 hover:border-primary/30 hover:bg-surface-light/80 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Phone</p>
                      <p className="text-sm text-text-primary group-hover:text-primary-light transition-colors">{settings.phone}</p>
                    </div>
                  </a>
                )}

                {settings.githubUrl && (
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-surface-light/50 hover:border-primary/30 hover:bg-surface-light/80 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">GitHub</p>
                      <p className="text-sm text-text-primary group-hover:text-primary-light transition-colors">
                        {settings.githubUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </p>
                    </div>
                  </a>
                )}

                {settings.linkedInUrl && (
                  <a
                    href={settings.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-surface-light/50 hover:border-primary/30 hover:bg-surface-light/80 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">LinkedIn</p>
                      <p className="text-sm text-text-primary group-hover:text-primary-light transition-colors">
                        {settings.linkedInUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
