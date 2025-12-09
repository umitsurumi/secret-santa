import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptParticipantData } from "@/lib/encryption";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
        return NextResponse.json(
            { error: "Missing participant key" },
            { status: 400 }
        );
    }

    try {
        const participant = await prisma.participant.findUnique({
            where: { id: key },
            include: {
                activity: true,
                target: true,
                sender: true,
            },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Invalid participant key" },
                { status: 404 }
            );
        }

        const { activity, target, sender } = participant;

        // Response structure
        const responseData: any = {
            participant: {
                id: participant.id,
                nickname: participant.nickname,
                socialAccount: participant.socialAccount,
                // We don't necessarily need to return the user's own sensitive info decrypted here unless they want to verify it,
                // but for the reveal purpose, it's not the priority. Let's keep it minimal.
            },
            activity: {
                id: activity.id,
                name: activity.name,
                status: activity.status,
                deadline: activity.deadline,
            },
        };

        // Logic based on status
        if (activity.status === "OPEN") {
            // No reveal data yet
            return NextResponse.json({
                success: true,
                data: responseData,
                message: "Waiting for matching",
            });
        }

        if (activity.status === "MATCHED" || activity.status === "REVEALED") {
            // Reveal Target
            if (target) {
                const decryptedTarget = decryptParticipantData({
                    realName: target.realName,
                    phone: target.phone,
                    address: target.address,
                });

                responseData.target = {
                    nickname: target.nickname,
                    socialAccount: target.socialAccount,
                    wishes: target.wishes,
                    ...decryptedTarget,
                };
            }
        }

        if (activity.status === "REVEALED") {
            // Reveal Sender
            if (sender) {
                // usually we don't need the sender's private info (address/phone), just their identity.
                // The Sender's `wishes` are for ME (their target).
                // So I should see `sender.wishes`.

                responseData.sender = {
                    nickname: sender.nickname,
                    socialAccount: sender.socialAccount,
                    wishes: sender.wishes, // The message the sender wrote for their target (me)
                };
            }
        }

        return NextResponse.json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.error("Reveal API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
