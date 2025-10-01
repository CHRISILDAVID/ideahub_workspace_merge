import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";

/**
 * POST /api/users
 * Create a new user (signup)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, fullName, password } = body;

    if (!email || !username || !fullName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        fullName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users
 * Search users by username or email
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let where: any = {};

    if (query) {
      where = {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { fullName: { contains: query, mode: "insensitive" } },
        ],
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        followers: true,
        following: true,
      },
      take: 20,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
