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
  skills: { name: string; icon: string; category: string }[];
  categories: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const defaultSkills = [
  { name: "Python", icon: "python", category: "Languages" },
  { name: "JavaScript", icon: "javascript", category: "Languages" },
  { name: "TypeScript", icon: "typescript", category: "Languages" },
  { name: "HTML5/CSS3", icon: "html5", category: "Languages" },
  { name: "React", icon: "react", category: "Frontend" },
  { name: "Next.js", icon: "nextjs", category: "Frontend" },
  { name: "Tailwind CSS", icon: "tailwindcss", category: "Frontend" },
  { name: "Responsive Design", icon: "responsive", category: "Frontend" },
  { name: "Django", icon: "django", category: "Backend" },
  { name: "FastAPI", icon: "fastapi", category: "Backend" },
  { name: "Flask", icon: "flask", category: "Backend" },
  { name: "REST APIs", icon: "rest", category: "Backend" },
  { name: "GraphQL", icon: "graphql", category: "Backend" },
  { name: "JWT/OAuth", icon: "jwt", category: "Backend" },
  { name: "Microservices", icon: "microservices", category: "Backend" },
  { name: "PostgreSQL", icon: "postgresql", category: "Database" },
  { name: "MySQL", icon: "mysql", category: "Database" },
  { name: "Redis", icon: "redis", category: "Database" },
  { name: "MongoDB", icon: "mongodb", category: "Database" },
  { name: "SQLAlchemy", icon: "sqlalchemy", category: "Database" },
  { name: "Prisma", icon: "prisma", category: "Database" },
  { name: "Docker", icon: "docker", category: "DevOps" },
  { name: "AWS", icon: "aws", category: "DevOps" },
  { name: "CI/CD", icon: "cicd", category: "DevOps" },
  { name: "Linux", icon: "linux", category: "DevOps" },
  { name: "Git", icon: "git", category: "DevOps" },
  { name: "Prompt Engineering", icon: "openai", category: "AI & LLMs" },
  { name: "LangChain", icon: "langchain", category: "AI & LLMs" },
  { name: "OpenAI API", icon: "openai", category: "AI & LLMs" },
  { name: "Vector Search", icon: "database", category: "AI & LLMs" },
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
