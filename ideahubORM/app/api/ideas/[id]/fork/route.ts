import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/ideas/[id]/fork
 * Fork an idea (creates a copy with new workspace)
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get the original idea
    const originalIdea = await prisma.idea.findUnique({
      where: { id: params.id },
      include: {
        workspace: true,
      },
    });

    if (!originalIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Check if idea is public
    if (originalIdea.visibility !== "PUBLIC") {
      return NextResponse.json(
        { error: "Cannot fork private ideas" },
        { status: 403 }
      );
    }

    // Create a new workspace for the fork
    const newWorkspace = await prisma.file.create({
      data: {
        fileName: `${originalIdea.title} (Fork)`,
        document: originalIdea.workspace?.document || null,
        whiteboard: originalIdea.workspace?.whiteboard || null,
      },
    });

    // Create the forked idea
    const forkedIdea = await prisma.idea.create({
      data: {
        title: `${originalIdea.title} (Fork)`,
        description: originalIdea.description,
        content: originalIdea.content,
        authorId: userId,
        tags: originalIdea.tags,
        category: originalIdea.category,
        license: originalIdea.license,
        visibility: originalIdea.visibility,
        language: originalIdea.language,
        status: "PUBLISHED",
        workspaceId: newWorkspace.id,
        isFork: true,
        forkedFromId: originalIdea.id,
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

    // Increment fork count on original idea
    await prisma.idea.update({
      where: { id: params.id },
      data: { forks: { increment: 1 } },
    });

    return NextResponse.json(forkedIdea, { status: 201 });
  } catch (error) {
    console.error("Error forking idea:", error);
    return NextResponse.json(
      { error: "Failed to fork idea" },
      { status: 500 }
    );
  }
}
