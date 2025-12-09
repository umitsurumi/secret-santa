import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encryptParticipantData } from "@/lib/encryption";
import { isActivityExpired } from "@/lib/utils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            activityId,
            nickname,
            socialAccount,
            realName,
            phone,
            address,
            wishes,
            thanks,
        } = body;

        // 1. 基础校验
        if (
            !activityId ||
            !nickname ||
            !realName ||
            !phone ||
            !address ||
            !wishes
        ) {
            return NextResponse.json(
                { error: "请填写所有必填字段" },
                { status: 400 }
            );
        }

        // 2. 检查活动有效性
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
        });

        if (!activity) {
            return NextResponse.json(
                { error: "无效的活动邀请码" },
                { status: 404 }
            );
        }

        if (activity.status !== "OPEN") {
            return NextResponse.json(
                { error: "活动已停止报名" },
                { status: 403 }
            );
        }

        if (isActivityExpired(activity.deadline)) {
            return NextResponse.json(
                { error: "活动报名已截止" },
                { status: 403 }
            );
        }

        // 3. 检查昵称是否重复
        const existingParticipant = await prisma.participant.findUnique({
            where: {
                activityId_nickname: {
                    activityId,
                    nickname,
                },
            },
        });

        if (existingParticipant) {
            return NextResponse.json(
                { error: "该昵称在当前活动中已被使用，请换一个" },
                { status: 409 }
            );
        }

        // 4. 加密敏感数据
        const encryptedData = encryptParticipantData({
            realName,
            phone,
            address,
        });

        // 5. 创建参与者
        const participant = await prisma.participant.create({
            data: {
                activityId,
                nickname,
                socialAccount: socialAccount || "",
                ...encryptedData,
                wishes,
                thanks: thanks || "",
            },
        });

        // 6. 返回结果 (Participant Key)
        return NextResponse.json({
            success: true,
            data: {
                participantKey: participant.id,
                nickname: participant.nickname,
                activityName: activity.name,
            },
            message: "报名成功",
        });
    } catch (error) {
        console.error("报名失败:", error);
        return NextResponse.json(
            { error: "报名失败，请稍后重试" },
            { status: 500 }
        );
    }
}
