import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import type { Project } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await prisma.project.findUnique({
        where: { slug },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...project,
        techStack: JSON.parse(project.techStack),
        screenshots: JSON.parse(project.screenshots),
      });
    }

    const where = category && category !== "all" ? { category } : {};

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const parsed = projects.map((p: Project) => ({
      ...p,
      techStack: JSON.parse(p.techStack),
      screenshots: JSON.parse(p.screenshots),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, longDescription, category, techStack, screenshots, githubUrl, liveUrl, featured } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || "",
        category: category || "Web",
        techStack: JSON.stringify(techStack || []),
        screenshots: JSON.stringify(screenshots || []),
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured: featured || false,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
