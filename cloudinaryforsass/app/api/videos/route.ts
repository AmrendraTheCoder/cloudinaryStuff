import { NextResponse } from "next/server"; // Remove NextRequest
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch {
    return NextResponse.json(
      { error: "Error while getting videos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
