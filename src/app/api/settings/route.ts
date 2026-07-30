import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { defaultSkills } from "@/lib/settings-api";

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "default",
          skills: JSON.stringify(defaultSkills),
        },
      });
    }

    return NextResponse.json({
      ...settings,
      skills: JSON.parse(settings.skills),
      categories: JSON.parse(settings.categories),
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      siteName, jobTitle, bio, email, phone,
      githubUrl, linkedInUrl, heroTagline, heroHighlight,
      experienceStartYear, avatar, skills, categories,
    } = body;

    const data: Record<string, unknown> = {};
    if (siteName !== undefined) data.siteName = siteName;
    if (jobTitle !== undefined) data.jobTitle = jobTitle;
    if (bio !== undefined) data.bio = bio;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (githubUrl !== undefined) data.githubUrl = githubUrl;
    if (linkedInUrl !== undefined) data.linkedInUrl = linkedInUrl;
    if (heroTagline !== undefined) data.heroTagline = heroTagline;
    if (heroHighlight !== undefined) data.heroHighlight = heroHighlight;
    if (experienceStartYear !== undefined) data.experienceStartYear = experienceStartYear;
    if (avatar !== undefined) data.avatar = avatar;
    if (skills !== undefined) data.skills = JSON.stringify(skills);
    if (categories !== undefined) data.categories = JSON.stringify(categories);

    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: "default" },
        data,
      });
    } else {
      settings = await prisma.settings.create({
        data: { id: "default", ...data },
      });
    }

    return NextResponse.json({
      ...settings,
      skills: JSON.parse(settings.skills),
      categories: JSON.parse(settings.categories),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
