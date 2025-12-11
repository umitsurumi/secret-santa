import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { removeKeyPrefix } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "缺少活动ID" }, { status: 400 });
        }

        // 去除前缀后查询
        const idWithoutPrefix = removeKeyPrefix(id);

        const activity = await prisma.activity.findUnique({
            where: { id: idWithoutPrefix },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                deadline: true,
            },
        });

        if (!activity) {
            return NextResponse.json({ error: "活动不存在" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: activity,
        });
    } catch (error) {
        console.error("获取活动信息失败:", error);
        return NextResponse.json(
            { error: "获取活动信息失败" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { adminKey, deadline, status, description } = body;

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

        // 去除前缀
        const idWithoutPrefix = removeKeyPrefix(id);
        const adminKeyWithoutPrefix = removeKeyPrefix(adminKey);

        // 1. Verify Activity & Admin Key
        const activity = await prisma.activity.findUnique({
            where: { id: idWithoutPrefix },
        });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        if (activity.adminKey !== adminKeyWithoutPrefix) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid Admin Key" },
                { status: 403 }
            );
        }

        // 2. Update logic
        const updateData: any = {};

        // Update Deadline (Only if OPEN)
        if (deadline) {
            if (activity.status !== "OPEN") {
                return NextResponse.json(
                    {
                        error: "Cannot update deadline after activity has started",
                    },
                    { status: 403 }
                );
            }
            const newDeadline = new Date(deadline);
            if (isNaN(newDeadline.getTime())) {
                return NextResponse.json(
                    { error: "Invalid deadline format" },
                    { status: 400 }
                );
            }
            updateData.deadline = newDeadline;
        }

        // Update Description (Only if OPEN)
        if (description !== undefined) {
            if (activity.status !== "OPEN") {
                return NextResponse.json(
                    {
                        error: "Cannot update description after activity has started",
                    },
                    { status: 403 }
                );
            }
            updateData.description = description;
        }

        // Update Status (e.g. to REVEALED)
        if (status) {
            // Validate status transitions
            if (status === "REVEALED" && activity.status !== "MATCHED") {
                return NextResponse.json(
                    { error: "Can only reveal sender after matching is done" },
                    { status: 400 }
                );
            }
            // For now, we mainly support switching to REVEALED.
            // Switching back to OPEN from MATCHED is dangerous as it might require clearing data.
            // We'll trust the admin knows what they are doing if they pass other statuses,
            // but let's be careful.

            // Allow: MATCHED -> REVEALED
            if (status === "REVEALED") {
                updateData.status = "REVEALED";
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const updatedActivity = await prisma.activity.update({
            where: { id: idWithoutPrefix },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            data: updatedActivity,
            message: "Activity updated",
        });
    } catch (error) {
        console.error("Update activity failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
