import { prisma } from './db';

/**
 * Fisher-Yates Shuffle 算法
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 执行匹配算法
 * @param activityId 活动ID
 * @returns 匹配结果
 */
export async function performMatching(activityId: string): Promise<boolean> {
  try {
    // 获取活动信息
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        participants: {
          select: { id: true }
        }
      }
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    if (activity.status !== 'OPEN') {
      throw new Error('Activity is not in OPEN state');
    }

    if (activity.participants.length < 2) {
      throw new Error('At least 2 participants required for matching');
    }

    // 获取参与者ID列表
    const participantIds = activity.participants.map(p => p.id);

    // Fisher-Yates Shuffle 打乱列表
    const shuffledIds = shuffleArray(participantIds);

    // 构建循环链表
    const matches: { participantId: string; targetId: string }[] = [];
    for (let i = 0; i < shuffledIds.length; i++) {
      const participantId = shuffledIds[i];
      const targetId = shuffledIds[(i + 1) % shuffledIds.length];
      matches.push({ participantId, targetId });
    }

    // 数据库事务更新
    await prisma.$transaction(async (tx) => {
      // 更新每个参与者的targetId
      for (const match of matches) {
        await tx.participant.update({
          where: { id: match.participantId },
          data: { targetId: match.targetId }
        });
      }

      // 更新活动状态为MATCHED
      await tx.activity.update({
        where: { id: activityId },
        data: { status: 'MATCHED' }
      });
    });

    return true;
  } catch (error) {
    console.error('Matching failed:', error);
    throw error;
  }
}

/**
 * 验证匹配是否有效（无自匹配，无重复）
 */
export function validateMatches(matches: { participantId: string; targetId: string }[]): boolean {
  const participantSet = new Set<string>();
  const targetSet = new Set<string>();

  for (const match of matches) {
    // 检查自匹配
    if (match.participantId === match.targetId) {
      return false;
    }

    // 检查重复
    if (participantSet.has(match.participantId) || targetSet.has(match.targetId)) {
      return false;
    }

    participantSet.add(match.participantId);
    targetSet.add(match.targetId);
  }

  // 检查是否形成完整循环
  return participantSet.size === targetSet.size;
}