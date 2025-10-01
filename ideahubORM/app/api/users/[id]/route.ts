import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/users/[id]
 * Get user profile
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        website: true,
        joinedAt: true,
        followers: true,
        following: true,
        publicRepos: true,
        isVerified: true,
        _count: {
          select: {
            ideas: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Update user profile
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { fullName, bio, location, website, avatarUrl } = body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        website: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
