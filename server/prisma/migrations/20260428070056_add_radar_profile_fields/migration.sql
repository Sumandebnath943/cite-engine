/*
  Warnings:

  - You are about to drop the column `lastScanned` on the `RadarProfile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RadarProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "securityScore" INTEGER,
    "lastScanResult" TEXT,
    "lastScannedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RadarProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RadarProfile" ("createdAt", "employer", "id", "industry", "jobTitle", "securityScore", "skills", "userId") SELECT "createdAt", "employer", "id", "industry", "jobTitle", "securityScore", "skills", "userId" FROM "RadarProfile";
DROP TABLE "RadarProfile";
ALTER TABLE "new_RadarProfile" RENAME TO "RadarProfile";
CREATE UNIQUE INDEX "RadarProfile_userId_key" ON "RadarProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
