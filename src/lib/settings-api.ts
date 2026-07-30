export interface SiteSettings {
  id: string;
  siteName: string;
  jobTitle: string;
  bio: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedInUrl: string;
  heroTagline: string;
  heroHighlight: string;
  experienceStartYear: number;
  avatar: string;
  skills: { name: string; icon: string }[];
  categories: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const defaultSkills = [
  { name: "Python", icon: "🐍" },
  { name: "JavaScript", icon: "📜" },
  { name: "TypeScript", icon: "📘" },
  { name: "Django", icon: "🎯" },
  { name: "FastAPI", icon: "⚡" },
  { name: "Flask", icon: "🔥" },
  { name: "REST APIs", icon: "🔗" },
  { name: "GraphQL", icon: "◈" },
  { name: "JWT/OAuth", icon: "🔐" },
  { name: "Microservices", icon: "🏗️" },
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "HTML5/CSS3", icon: "🌐" },
  { name: "Responsive Design", icon: "📱" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "MySQL", icon: "🗄️" },
  { name: "Redis", icon: "⚡" },
  { name: "MongoDB", icon: "🍃" },
  { name: "SQLAlchemy", icon: "🗃️" },
  { name: "Prisma", icon: "🔷" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁️" },
  { name: "CI/CD", icon: "🔄" },
  { name: "Linux", icon: "🐧" },
  { name: "Git", icon: "🔀" },
  { name: "Prompt Engineering", icon: "🤖" },
  { name: "LangChain", icon: "⛓️" },
  { name: "OpenAI API", icon: "🧠" },
  { name: "Vector Search", icon: "🔍" },
];

export function defaultSettings(): SiteSettings {
  return {
    id: "default",
    siteName: "Portfolio",
    jobTitle: "Full-Stack Developer",
    bio: "A passionate full-stack developer crafting modern web applications with clean code and thoughtful design.",
    email: "",
    phone: "",
    githubUrl: "",
    linkedInUrl: "",
    heroTagline: "Building Digital Experiences",
    heroHighlight: "Digital",
    experienceStartYear: 2020,
    avatar: "",
    skills: defaultSkills,
    categories: [],
  };
}
