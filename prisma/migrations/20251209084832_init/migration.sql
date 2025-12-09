-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('OPEN', 'MATCHED', 'REVEALED');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "adminKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "socialAccount" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wishes" TEXT NOT NULL,
    "thanks" TEXT,
    "targetId" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_adminKey_key" ON "Activity"("adminKey");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_targetId_key" ON "Participant"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_activityId_nickname_key" ON "Participant"("activityId", "nickname");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
