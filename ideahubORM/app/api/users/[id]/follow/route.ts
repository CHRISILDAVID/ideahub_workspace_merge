import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/users/[id]/follow
 * Follow/Unfollow a user
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { followerId } = body;

    if (!followerId) {
      return NextResponse.json(
        { error: "followerId is required" },
        { status: 400 }
      );
    }

    if (followerId === params.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: params.id,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.$transaction([
        prisma.follow.delete({
          where: { id: existingFollow.id },
        }),
        prisma.user.update({
          where: { id: followerId },
          data: { following: { decrement: 1 } },
        }),
        prisma.user.update({
          where: { id: params.id },
          data: { followers: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.$transaction([
        prisma.follow.create({
          data: {
            followerId,
            followingId: params.id,
          },
        }),
        prisma.user.update({
          where: { id: followerId },
          data: { following: { increment: 1 } },
        }),
        prisma.user.update({
          where: { id: params.id },
          data: { followers: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ following: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/[id]/follow
 * Check if a user is following another user
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const followerId = searchParams.get("followerId");

    if (!followerId) {
      return NextResponse.json({ following: false });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: params.id,
        },
      },
    });

    return NextResponse.json({ following: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}
