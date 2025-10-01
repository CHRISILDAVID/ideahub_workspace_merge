import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/ideas
 * Fetch all ideas with filters
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    const query = searchParams.get("query");
    const sort = searchParams.get("sort") || "newest";
    const visibility = searchParams.get("visibility") || "PUBLIC";

    let where: any = {
      status: "PUBLISHED",
    };

    // Only show public ideas by default unless userId is provided
    if (visibility === "PUBLIC") {
      where.visibility = "PUBLIC";
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (language && language !== "all") {
      where.language = language;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "most-stars":
        orderBy = { stars: "desc" };
        break;
      case "most-forks":
        orderBy = { forks: "desc" };
        break;
      case "recently-updated":
        orderBy = { updatedAt: "desc" };
        break;
    }

    const ideas = await prisma.idea.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ideas
 * Create a new idea with workspace
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      content,
      authorId,
      tags,
      category,
      license,
      visibility,
      language,
      status,
    } = body;

    // Validate required fields
    if (!title || !description || !authorId || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create workspace first
    const workspace = await prisma.file.create({
      data: {
        fileName: title,
      },
    });

    // Create idea with workspace
    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        content: content || "",
        authorId,
        tags: tags || [],
        category,
        license: license || "MIT",
        visibility: visibility || "PUBLIC",
        language,
        status: status || "PUBLISHED",
        workspaceId: workspace.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        workspace: true,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
