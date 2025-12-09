import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRandomString } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, deadline } = body;

    // 验证输入
    if (!name || !deadline) {
      return NextResponse.json(
        { error: '活动名称和截止时间不能为空' },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: '无效的截止时间格式' },
        { status: 400 }
      );
    }

    // 创建活动
    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        deadline: deadlineDate,
        adminKey: generateRandomString(32),
      },
    });

    // 返回结果（包含Invite Key和Admin Key）
    return NextResponse.json({
      success: true,
      data: {
        activityId: activity.id, // Invite Key
        adminKey: activity.adminKey,
        name: activity.name,
        deadline: activity.deadline,
      },
      message: '活动创建成功，请妥善保存Admin Key',
    });
  } catch (error) {
    console.error('创建活动失败:', error);
    return NextResponse.json(
      { error: '创建活动失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    if (!adminKey) {
      return NextResponse.json(
        { error: '缺少Admin Key参数' },
        { status: 400 }
      );
    }

    // 根据Admin Key获取活动信息
    const activity = await prisma.activity.findUnique({
      where: { adminKey },
      include: {
        participants: {
          select: {
            id: true,
            nickname: true,
            socialAccount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: '活动不存在或Admin Key无效' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('获取活动信息失败:', error);
    return NextResponse.json(
      { error: '获取活动信息失败，请稍后重试' },
      { status: 500 }
    );
  }
}