-- CreateTable
CREATE TABLE "NutritionalPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MealEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "mealDescription" TEXT NOT NULL,
    "nutritionalPlanId" TEXT NOT NULL,
    CONSTRAINT "MealEntry_nutritionalPlanId_fkey" FOREIGN KEY ("nutritionalPlanId") REFERENCES "NutritionalPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MealEntry_nutritionalPlanId_dayOfWeek_mealType_key" ON "MealEntry"("nutritionalPlanId", "dayOfWeek", "mealType");
