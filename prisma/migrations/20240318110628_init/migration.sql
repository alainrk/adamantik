/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExerciseInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mesocycle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MesocycleTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Exercise";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExerciseInstance";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Mesocycle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MesocycleTemplate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "muscleGroup" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "videoUrl" TEXT,
    "userId" INTEGER,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "exercise_instances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relativeOrder" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "expectedRir" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "sets" TEXT,
    CONSTRAINT "exercise_instances_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "exercise_instances_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "mesocycles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "numberOfWeeks" INTEGER NOT NULL,
    "numberOfDays" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "template" TEXT NOT NULL,
    CONSTRAINT "mesocycles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "mesocycle_template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "userId" INTEGER,
    "numberOfDays" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "template" TEXT NOT NULL,
    CONSTRAINT "mesocycle_template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Week" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numberOfDays" INTEGER NOT NULL,
    "relativeOrder" INTEGER NOT NULL,
    "mesocycleId" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "Week_mesocycleId_fkey" FOREIGN KEY ("mesocycleId") REFERENCES "mesocycles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_Week" ("completedAt", "createdAt", "id", "mesocycleId", "numberOfDays", "relativeOrder") SELECT "completedAt", "createdAt", "id", "mesocycleId", "numberOfDays", "relativeOrder" FROM "Week";
DROP TABLE "Week";
ALTER TABLE "new_Week" RENAME TO "Week";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
