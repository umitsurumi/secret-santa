import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { performMatching } from "@/lib/matching";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { adminKey } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing activity ID" },
                { status: 400 }
            );
        }

        if (!adminKey) {
            return NextResponse.json(
                { error: "Unauthorized: Missing Admin Key" },
                { status: 401 }
            );
        }

        // 1. Verify Activity & Admin Key
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: { participants: true },
        });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        if (activity.adminKey !== adminKey) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid Admin Key" },
                { status: 403 }
            );
        }

        // 2. Pre-check conditions
        if (activity.status !== "OPEN") {
            return NextResponse.json(
                { error: "Activity is not open for matching" },
                { status: 400 }
            );
        }

        if (activity.participants.length < 2) {
            return NextResponse.json(
                {
                    error: "At least 2 participants are required to start matching",
                },
                { status: 400 }
            );
        }

        // 3. Perform Matching
        await performMatching(id);

        return NextResponse.json({
            success: true,
            message: "Matching completed successfully",
        });
    } catch (error: any) {
        console.error("Matching trigger failed:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
