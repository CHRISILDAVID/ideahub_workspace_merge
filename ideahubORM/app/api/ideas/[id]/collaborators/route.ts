import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/ideas/[id]/collaborators
 * Get all collaborators for an idea
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { ideaId: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ideas/[id]/collaborators
 * Add a collaborator to an idea (max 3 total)
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Check current collaborator count
    const currentCount = await prisma.collaborator.count({
      where: { ideaId: params.id },
    });

    if (currentCount >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 collaborators allowed per idea" },
        { status: 400 }
      );
    }

    // Add collaborator
    const collaborator = await prisma.collaborator.create({
      data: {
        ideaId: params.id,
        userId,
        role: role || "COLLABORATOR",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(collaborator, { status: 201 });
  } catch (error: any) {
    console.error("Error adding collaborator:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User is already a collaborator" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add collaborator" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ideas/[id]/collaborators
 * Remove a collaborator from an idea
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await prisma.collaborator.delete({
      where: {
        ideaId_userId: {
          ideaId: params.id,
          userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
