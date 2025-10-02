import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * GET /api/auth/session
 * Get current user session
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify JWT token
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    );

    const userId = verified.payload.userId as string;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
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
      },
    });

    if (!user) {
      // User not found, clear cookie
      cookieStore.delete("auth-token");
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error getting session:", error);
    // Invalid token, clear cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return NextResponse.json({ user: null });
  }
}
