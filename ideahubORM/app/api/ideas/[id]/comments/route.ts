import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/ideas/[id]/comments
 * Get all comments for an idea
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { ideaId: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ideas/[id]/comments
 * Create a new comment
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { content, authorId, parentId } = body;

    if (!content || !authorId) {
      return NextResponse.json(
        { error: "content and authorId are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        ideaId: params.id,
        ...(parentId && { parentId }),
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
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
