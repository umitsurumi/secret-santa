import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "缺少活动ID" }, { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: { id },
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
