import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { removeKeyPrefix } from "@/lib/utils";
import { encryptParticipantData } from "@/lib/encryption";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            nickname,
            socialAccount,
            realName,
            phone,
            address,
            noteToSanta,
            noteToTarget,
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing participant ID" },
                { status: 400 }
            );
        }

        const idWithoutPrefix = removeKeyPrefix(id);

        // 1. Verify participant exists
        const participant = await prisma.participant.findUnique({
            where: { id: idWithoutPrefix },
            include: { activity: true },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Participant not found" },
                { status: 404 }
            );
        }

        // 2. Check activity status
        if (participant.activity.status !== "OPEN") {
            return NextResponse.json(
                {
                    error: "Cannot update information after matching has started",
                },
                { status: 403 }
            );
        }

        // 3. Check for nickname conflict if nickname changed
        if (nickname !== participant.nickname) {
            const existingParticipant = await prisma.participant.findUnique({
                where: {
                    activityId_nickname: {
                        activityId: participant.activityId,
                        nickname,
                    },
                },
            });

            if (existingParticipant) {
                return NextResponse.json(
                    { error: "Nickname already taken in this activity" },
                    { status: 409 }
                );
            }
        }

        // 4. Encrypt sensitive data
        const encryptedData = encryptParticipantData({
            realName,
            phone,
            address,
        });

        // 5. Update
        await prisma.participant.update({
            where: { id: idWithoutPrefix },
            data: {
                nickname,
                socialAccount,
                ...encryptedData,
                noteToSanta,
                noteToTarget,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Information updated successfully",
        });
    } catch (error) {
        console.error("Update participant failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const adminKey = searchParams.get("adminKey");
        // We now allow participants to delete themselves using their own ID (which acts as the key)
        // If adminKey is present, we enforce admin checks.
        // If no adminKey, we assume it's the user deleting themselves (authenticated by knowing the ID/Key path).
        // Since the route is /participants/[id], and [id] IS the key, possession of the key grants access.

        if (!id) {
            return NextResponse.json(
                { error: "Missing participant ID" },
                { status: 400 }
            );
        }

        // 去除前缀
        const idWithoutPrefix = removeKeyPrefix(id);
        const adminKeyWithoutPrefix = adminKey ? removeKeyPrefix(adminKey) : "";

        // 1. Verify participant exists and get activity info
        const participant = await prisma.participant.findUnique({
            where: { id: idWithoutPrefix },
            include: { activity: true },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Participant not found" },
                { status: 404 }
            );
        }

        // 2. Auth Check
        // If adminKey is provided, verify it.
        if (adminKey) {
            if (participant.activity.adminKey !== adminKeyWithoutPrefix) {
                return NextResponse.json(
                    { error: "Unauthorized: Invalid Admin Key" },
                    { status: 403 }
                );
            }
        }
        // If no adminKey, the user is authorized by virtue of having the participant ID (Key).
        // No additional check needed here as the route parameter itself is the secret key.

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
            where: { id: idWithoutPrefix },
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
