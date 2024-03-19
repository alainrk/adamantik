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
    CONSTRAINT "exercise_instances_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
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
    "provider" TEXT NOT NULL,
    "providerIdToken" TEXT,
    "providerAccessToken" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "weeks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numberOfDays" INTEGER NOT NULL,
    "relativeOrder" INTEGER NOT NULL,
    "mesocycleId" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "weeks_mesocycleId_fkey" FOREIGN KEY ("mesocycleId") REFERENCES "mesocycles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relativeOrder" INTEGER NOT NULL,
    "weekId" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "workouts_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "weeks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
