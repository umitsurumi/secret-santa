import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const adminKey = searchParams.get("adminKey");

        if (!id) {
            return NextResponse.json(
                { error: "Missing participant ID" },
                { status: 400 }
            );
        }

        if (!adminKey) {
            return NextResponse.json(
                { error: "Unauthorized: Missing Admin Key" },
                { status: 401 }
            );
        }

        // 1. Verify participant exists and get activity info
        const participant = await prisma.participant.findUnique({
            where: { id },
            include: { activity: true },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Participant not found" },
                { status: 404 }
            );
        }

        // 2. Verify Admin Key
        if (participant.activity.adminKey !== adminKey) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid Admin Key" },
                { status: 403 }
            );
        }

        // 3. Check activity status (Can only remove in OPEN status?)
        // Requirement says: "Management Phase ... Operations include: Delete user ... (implied during OPEN)"
        // But if someone is really problematic, maybe allow deleting later?
        // But if matched, deleting breaks the circle.
        // Let's restrict to OPEN for now to ensure integrity.
        if (participant.activity.status !== "OPEN") {
            return NextResponse.json(
                {
                    error: "Cannot remove participant after matching has started",
                },
                { status: 403 }
            );
        }

        // 4. Delete
        await prisma.participant.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Participant removed",
        });
    } catch (error) {
        console.error("Delete participant failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
