CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "displayName" TEXT NOT NULL DEFAULT 'User',
  "isBanned" BOOLEAN NOT NULL DEFAULT false,
  "acceptedTermsAt" TIMESTAMP(3) NOT NULL,
  "acceptedPrivacyAt" TIMESTAMP(3) NOT NULL,
  "ageConfirmedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InviteCode" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "maxUses" INTEGER NOT NULL,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Device" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "pushToken" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Note" (
  "id" TEXT NOT NULL,
  "authorUserId" TEXT NOT NULL,
  "text" TEXT,
  "linkUrl" TEXT,
  "linkType" TEXT,
  "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
  "latitudeRounded" DOUBLE PRECISION NOT NULL,
  "longitudeRounded" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "hiddenAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "reportCount" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Presence" (
  "userId" TEXT NOT NULL,
  "lastLatitudeRounded" DOUBLE PRECISION NOT NULL,
  "lastLongitudeRounded" DOUBLE PRECISION NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Presence_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "Report" (
  "id" TEXT NOT NULL,
  "noteId" TEXT NOT NULL,
  "reporterUserId" TEXT NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NotificationEvent" (
  "id" TEXT NOT NULL,
  "recipientUserId" TEXT NOT NULL,
  "noteId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimitEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");
CREATE UNIQUE INDEX "Device_provider_pushToken_key" ON "Device"("provider", "pushToken");
CREATE UNIQUE INDEX "Report_noteId_reporterUserId_key" ON "Report"("noteId", "reporterUserId");
CREATE UNIQUE INDEX "NotificationEvent_recipientUserId_noteId_type_key" ON "NotificationEvent"("recipientUserId", "noteId", "type");

CREATE INDEX "User_isBanned_idx" ON "User"("isBanned");
CREATE INDEX "Device_userId_idx" ON "Device"("userId");
CREATE INDEX "Device_isActive_idx" ON "Device"("isActive");
CREATE INDEX "Note_expiresAt_idx" ON "Note"("expiresAt");
CREATE INDEX "Note_createdAt_idx" ON "Note"("createdAt");
CREATE INDEX "Note_hiddenAt_deletedAt_idx" ON "Note"("hiddenAt", "deletedAt");
CREATE INDEX "Note_latitudeRounded_longitudeRounded_idx" ON "Note"("latitudeRounded", "longitudeRounded");
CREATE INDEX "Note_authorUserId_idx" ON "Note"("authorUserId");
CREATE INDEX "Presence_lastSeenAt_idx" ON "Presence"("lastSeenAt");
CREATE INDEX "Presence_lastLatitudeRounded_lastLongitudeRounded_idx" ON "Presence"("lastLatitudeRounded", "lastLongitudeRounded");
CREATE INDEX "Report_noteId_idx" ON "Report"("noteId");
CREATE INDEX "Report_reporterUserId_idx" ON "Report"("reporterUserId");
CREATE INDEX "NotificationEvent_recipientUserId_createdAt_idx" ON "NotificationEvent"("recipientUserId", "createdAt");
CREATE INDEX "NotificationEvent_noteId_idx" ON "NotificationEvent"("noteId");
CREATE INDEX "RateLimitEvent_userId_action_createdAt_idx" ON "RateLimitEvent"("userId", "action", "createdAt");

ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RateLimitEvent" ADD CONSTRAINT "RateLimitEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

