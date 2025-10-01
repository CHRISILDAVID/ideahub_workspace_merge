import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/ideas/[id]/like
 * Like/Unlike an idea
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

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId: params.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like and decrement count
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.idea.update({
          where: { id: params.id },
          data: { stars: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ liked: false, stars: -1 });
    } else {
      // Like - create like and increment count
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            ideaId: params.id,
          },
        }),
        prisma.idea.update({
          where: { id: params.id },
          data: { stars: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ liked: true, stars: 1 }, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ideas/[id]/like
 * Check if user has liked the idea
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ liked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId: params.id,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}
