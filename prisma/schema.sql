-- 创建 ActivityStatus 枚举类型
CREATE TYPE "ActivityStatus" AS ENUM ('OPEN', 'MATCHED', 'REVEALED');

-- 创建 Activity 表
CREATE TABLE "Activity" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(), -- 对应 Invite Key
    "adminKey" TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(), -- 管理 Key
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建 Participant 表
CREATE TABLE "Participant" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(), -- 对应 Participant Key
    "activityId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL, -- 昵称
    
    -- 敏感信息 (存入数据库前需应用层加密)
    "realName" TEXT NOT NULL, -- 真实姓名 (加密)
    "socialAccount" TEXT NOT NULL, -- 社交账号 (可不加密，便于房主确认身份)
    "phone" TEXT NOT NULL, -- 手机号 (加密)
    "address" TEXT NOT NULL, -- 地址 (加密)
    
    "noteToSanta" TEXT NOT NULL, -- 给送礼人的备注（愿望清单、偏好等）
    "noteToTarget" TEXT, -- 给收礼人的备注（祝福语等）
    
    -- 关系映射
    "targetId" TEXT UNIQUE, -- 我要送给谁 (Self-relation ID)
    
    -- 外键约束
    CONSTRAINT "Participant_activityId_fkey" 
        FOREIGN KEY ("activityId") 
        REFERENCES "Activity"("id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "Participant_targetId_fkey" 
        FOREIGN KEY ("targetId") 
        REFERENCES "Participant"("id")
);

-- 创建索引
CREATE INDEX "Participant_activityId_idx" ON "Participant"("activityId");
CREATE INDEX "Participant_targetId_idx" ON "Participant"("targetId");

-- 创建唯一约束：保证同房间内昵称唯一
CREATE UNIQUE INDEX "Participant_activityId_nickname_key" 
    ON "Participant"("activityId", "nickname");

-- 添加注释说明
COMMENT ON COLUMN "Activity"."id" IS '对应 Invite Key';
COMMENT ON COLUMN "Activity"."adminKey" IS '管理 Key';
COMMENT ON COLUMN "Activity"."status" IS '活动状态: OPEN-报名中, MATCHED-已抽选, REVEALED-已揭晓';

COMMENT ON COLUMN "Participant"."id" IS '对应 Participant Key';
COMMENT ON COLUMN "Participant"."realName" IS '真实姓名 (需应用层加密)';
COMMENT ON COLUMN "Participant"."socialAccount" IS '社交账号 (可不加密，便于房主确认身份)';
COMMENT ON COLUMN "Participant"."phone" IS '手机号 (需应用层加密)';
COMMENT ON COLUMN "Participant"."address" IS '地址 (需应用层加密)';
COMMENT ON COLUMN "Participant"."noteToSanta" IS '给送礼人的备注（愿望清单、偏好等）';
COMMENT ON COLUMN "Participant"."noteToTarget" IS '给收礼人的备注（祝福语等）';
COMMENT ON COLUMN "Participant"."targetId" IS '我要送给谁 (Self-relation ID)';
