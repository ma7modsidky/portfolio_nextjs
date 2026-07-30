"use client";

import Link from "next/link";

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  screenshots: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  index?: number;
}

const categoryColors: Record<string, string> = {
  Web: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Mobile: "bg-green-500/10 text-green-400 border-green-500/20",
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  DevOps: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Data: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Game: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ProjectCard({
  title,
  slug,
  description,
  category,
  techStack,
  screenshots,
  githubUrl,
  liveUrl,
  featured,
  index = 0,
}: ProjectCardProps) {
  const colorClass = categoryColors[category] || categoryColors.Web;
  const previewImg = screenshots?.[0];

  return (
    <Link href={`/projects/${slug}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden border border-white/5 bg-surface-light/50 backdrop-blur-sm
                    transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5
                    h-full flex flex-col"
        style={{
          animation: `slideUp 0.5s ease-out ${index * 0.1}s forwards`,
          opacity: 0,
        }}
      >
        {/* Image Preview */}
        <div className="relative h-48 overflow-hidden bg-surface-lighter/50">
          {previewImg ? (
            <img
              src={previewImg}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium border border-accent/30 backdrop-blur-sm">
              ⭐ Featured
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${colorClass}`}
            >
              {category}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary-light transition-colors duration-300 mb-2">
            {title}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-white/5 text-text-muted text-xs"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-text-muted text-xs">
                +{techStack.length - 4}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
            {githubUrl && (
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Code
              </span>
            )}
            {liveUrl && (
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-secondary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              View Details
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
